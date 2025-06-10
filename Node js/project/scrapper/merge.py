import asyncio
import json
import os
from typing import List, Dict, Optional
import time
import re
import aiohttp
from playwright.async_api import async_playwright, Browser
from bs4 import BeautifulSoup
import aiofiles
import pandas as pd
import logging
from logging.handlers import RotatingFileHandler

# --- Configuration ---
CHUNK_SIZE = 3  # Number of companies to process in each batch (reduced for combined processing)
MAX_RETRIES = 2  # Maximum retries for failed operations
TIMEOUT_SECONDS = 30  # Total time allowed per page
DELAY_BETWEEN_REQUESTS = 1.0  # Delay between requests
OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Ollama API endpoint
LLAMA_MODEL = "llama3.2:latest"  # LLaMA model
INPUT_CSV = 'baki.csv'  # Input CSV with company data
OUTPUT_DIR = 'job_data'
MAX_LINKS_TO_VISIT = 10000  # Maximum links to check per company
MAX_CAREER_LINKS_PER_COMPANY = 50  # Maximum career links to find before checking

# --- Job Keywords with Regex Patterns ---
JOB_KEYWORDS = [
    r'job(s)?\b', r'career(s)?\b', r'vacancy(ies)?\b', r'opening(s)?\b',
    r'opportunity(ies)?\b', r'position(s)?\b', r'work-with-us', r'join-us',
    r'join-our-team', r'join-team', r'employment', r'hiring', r'recruitment',
    r'work-for-us', r'join-the-team', r'career-opportunities', r'job-opportunities',
    r'current-openings', r'current-opportunities', r'open-positions', r'job-listing',
    r'our-jobs', r'work-at', r'work-with', r'team-openings', r'careers-page',
    r'job-page', r'apply-now', r'we-are-hiring', r'our-openings', r'job-openings',
    r'emploi(s)?\b', r'carriere(s)?\b', r'karriere', r'trabajo(s)?\b',
    r'empleo(s)?\b', r'lavoro', r'arbeit', r'vacature(s)?\b',
    r'trabajar-con-nosotros', r'lavora-con-noi',
    r'careers\.(html|php|aspx)', r'jobs\.(html|php|aspx)'
]
JOB_KEYWORD_PATTERN = re.compile('|'.join(JOB_KEYWORDS), re.IGNORECASE)

# --- Logging Setup ---
def setup_logging():
    logger = logging.getLogger('merged_career_scraper')
    logger.setLevel(logging.INFO)
    
    file_handler = RotatingFileHandler(
        'merged_career_scraper.log',
        maxBytes=5*1024*1024,  # 5MB
        backupCount=3
    )
    
    console_handler = logging.StreamHandler()
    
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

logger = setup_logging()

# --- LLaMA Prompts ---
PROMPT_CAREER_PAGE_CHECK = """
Analyze the following webpage content to determine if it is a career or job listings page.
Look for indicators such as job titles, position descriptions, application buttons, or keywords like jobs, careers, openings, vacancies, positions, apply, hiring.

Content:
{content}

Return a JSON object with:
1. "is_career_page": boolean (true if the page contains job listings or career-related content, false otherwise)
2. "explanation": string (brief explanation of why it is or isn't a career page)

JSON Response:
"""

PROMPT_JOB_DISCOVERY = """
Analyze this HTML content from a career page and identify job listings.

Content:
{content}

Please return a JSON object with:
1. "has_job_listings": boolean
2. "job_listings": array of jobs, each with:
   - title
   - location (if available)
   - department (if available)
   - description (brief summary if available)

Important: 
- ONLY include jobs that are **explicitly and visibly listed** in the provided HTML content.
- DO NOT make up, assume, or hallucinate jobs. If no jobs are present in the HTML, return an empty list.
- If a field is not available, omit it from the JSON.
- Return valid JSON format only.
- If no job listings are found, return {{"has_job_listings": false, "job_listings": []}}

Are you sure? Only return jobs that are clearly present in the HTML above.

JSON Response:
"""

# --- Async LLaMA Query ---
async def ask_llama_async(prompt: str, semaphore: asyncio.Semaphore) -> Dict:
    """Async LLaMA API call with rate limiting and error handling"""
    async with semaphore:
        try:
            logger.debug(f"Sending prompt to LLaMA (length: {len(prompt)} chars)")
            
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": LLAMA_MODEL,
                    "prompt": prompt,
                    "format": "json",
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "max_tokens": 2048,
                    }
                }
                
                async with session.post(OLLAMA_API_URL, json=payload, timeout=60) as response:
                    if response.status != 200:
                        logger.error(f"LLaMA API error: HTTP {response.status}")
                        return {"has_job_listings": False, "job_listings": [], "is_career_page": False, "explanation": f"API error {response.status}"}
                    
                    full_response = await response.text()
                    response_data = json.loads(full_response)
                    
                    if not response_data.get("response"):
                        logger.warning("LLaMA returned empty response")
                        return {"has_job_listings": False, "job_listings": [], "is_career_page": False, "explanation": "Empty response"}
                    
                    response_text = response_data["response"].strip()
                    
                    try:
                        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                        if json_match:
                            json_str = json_match.group(0)
                            parsed_json = json.loads(json_str)
                            logger.debug(f"Successfully parsed JSON from LLaMA")
                            return parsed_json
                        else:
                            logger.error("No JSON object found in LLaMA response")
                            return {"has_job_listings": False, "job_listings": [], "is_career_page": False, "explanation": "No valid JSON"}
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON decode error: {e}")
                        return {"has_job_listings": False, "job_listings": [], "is_career_page": False, "explanation": "Invalid JSON"}
                
        except Exception as e:
            logger.error(f"LLaMA API error: {e}")
            return {"has_job_listings": False, "job_listings": [], "is_career_page": False, "explanation": str(e)}

# --- HTML Parsing ---
def extract_visible_sections(html: str, base_url: str) -> Dict:
    """Extract job-related sections and links from HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # Remove non-content elements
    for element in soup(["script", "style"]):
        element.decompose()
    
    content = {
        'header': {'text': '', 'links': []},
        'footer': {'text': '', 'links': []},
        'body': {'text': '', 'links': []}
    }
    
    # Extract header
    header = soup.find(['header', 'nav'])
    if header:
        content['header'] = extract_text_with_links(header, base_url)
    
    # Extract footer
    footer = soup.find('footer')
    if footer:
        content['footer'] = extract_text_with_links(footer, base_url)
    
    # Extract body
    body = soup.find('body')
    if body:
        content['body'] = extract_text_with_links(body, base_url)
    
    return content

def extract_text_with_links(soup_element, base_url: str) -> Dict:
    """Extract text and links from a BeautifulSoup element"""
    text_content = []
    links = []
    
    for text in soup_element.stripped_strings:
        text_content.append(text.strip())
    
    for a in soup_element.find_all('a', href=True):
        href = a['href']
        text = a.get_text(strip=True)
        if href and text:
            if not href.startswith(('http://', 'https://')):
                href = f"{base_url.rstrip('/')}/{href.lstrip('/')}"
            links.append({'text': text, 'href': href})
    
    return {
        'text': ' '.join(text_content),
        'links': links
    }

def extract_job_sections(html: str) -> List[str]:
    """Extract job-related sections from HTML for job discovery"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # Remove script, style, and other non-content elements
    for element in soup(["script", "style", "nav", "footer", "header"]):
        element.decompose()
    
    # Job-specific selectors
    job_selectors = [
        'div[class*="job"]', 'div[class*="position"]', 'div[class*="opening"]',
        'div[class*="career"]', 'div[class*="role"]', 'div[class*="vacancy"]',
        'section[class*="job"]', 'section[class*="career"]', 'section[class*="position"]',
        'article[class*="job"]', '[data-testid*="job"]', '[id*="job"]',
        'main', 'article'
    ]
    
    sections = []
    
    for selector in job_selectors:
        elements = soup.select(selector)
        for element in elements:
            text = element.get_text(separator=' ', strip=True)
            if len(text) > 100:  # Only include substantial content
                sections.append(text)
    
    # Fallback to body content if no specific sections found
    if not sections:
        body = soup.find('body')
        if body:
            body_text = body.get_text(separator=' ', strip=True)
            if len(body_text) > 200:
                sections.append(body_text)
    
    return sections
def normalize_url(url: str) -> str:
    """Normalize malformed URLs"""
    url = url.strip()
    if not url:
        return ""
    
    # Only add protocol if it's completely missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    return url

# --- Main Company Processing Function ---
async def process_company(browser: Browser, company: str, homepage_url: str, 
                         browser_semaphore: asyncio.Semaphore, 
                         api_semaphore: asyncio.Semaphore) -> Dict:
    """
    Optimized: Early exit on jobs found, prioritize high-confidence links.
    """
    async with browser_semaphore:
        links_visited = 0
        jobs_found = []
        career_url_found = None

        for attempt in range(MAX_RETRIES + 1):
            page = None
            try:
                logger.info(f"[{company}] Processing homepage: {homepage_url}")

                page = await browser.new_page()
                await page.set_extra_http_headers({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                })

                await page.goto(homepage_url, wait_until='domcontentloaded', timeout=TIMEOUT_SECONDS * 1000)
                await asyncio.sleep(DELAY_BETWEEN_REQUESTS)

                html = await page.content()
                base_url = homepage_url.rstrip('/')
                sections = extract_visible_sections(html, base_url)

                # Collect potential career links (prioritize high-confidence)
                potential_links = []
                try:
                    host = base_url.split('://')[1].split('/')[0]
                except Exception:
                    host = base_url

                patterns = [
                    f"{base_url}/careers", f"{base_url}/jobs", f"{base_url}/career",
                    f"{base_url}/about/careers", f"https://careers.{host}",
                    f"https://jobs.{host}", f"{base_url}/join-us", 
                    f"{base_url}/work-with-us", f"{base_url}/opportunities",
                    f"{base_url}/our-jobs", f"{base_url}/team-openings",
                    f"{base_url}/work-at", f"{base_url}/job-openings"
                ]

                for pattern in patterns:
                    if JOB_KEYWORD_PATTERN.search(pattern):
                        potential_links.append({
                            'url': pattern,
                            'confidence': 1.0,  # Highest confidence
                            'method': 'pattern_match'
                        })

                for section_name, section_content in sections.items():
                    for link in section_content['links']:
                        if JOB_KEYWORD_PATTERN.search(link['href']) or JOB_KEYWORD_PATTERN.search(link['text']):
                            confidence = 0.8 if section_name in ['header', 'footer'] else 0.6
                            potential_links.append({
                                'url': link['href'],
                                'confidence': confidence,
                                'method': f"{section_name}_link"
                            })

                # Remove duplicates and sort by confidence
                seen_urls = set()
                unique_links = []
                for link in sorted(potential_links, key=lambda x: x['confidence'], reverse=True):
                    if link['url'] not in seen_urls and len(unique_links) < MAX_CAREER_LINKS_PER_COMPANY:
                        unique_links.append(link)
                        seen_urls.add(link['url'])

                logger.info(f"[{company}] Found {len(unique_links)} potential career links")

                # Visit each link, stop at first jobs found
                for link in unique_links:
                    if links_visited >= MAX_LINKS_TO_VISIT:
                        logger.info(f"[{company}] Reached maximum links limit ({MAX_LINKS_TO_VISIT})")
                        break

                    try:
                        logger.info(f"[{company}] Checking link {links_visited + 1}: {link['url']} (method: {link['method']})")
                        await page.goto(link['url'], wait_until='domcontentloaded', timeout=15000)
                        links_visited += 1

                        link_html = await page.content()
                        sections = extract_visible_sections(link_html, link['url'])
                        full_content = ' '.join(
                            section['text'] for section in sections.values() if section['text']
                        )[:6000]

                        career_prompt = PROMPT_CAREER_PAGE_CHECK.format(content=full_content)
                        career_result = await ask_llama_async(career_prompt, api_semaphore)

                        if not career_result.get("is_career_page"):
                            continue

                        job_sections = extract_job_sections(link_html)
                        job_content = " ".join(job_sections)[:8000]
                        job_prompt = PROMPT_JOB_DISCOVERY.format(content=job_content)
                        job_result = await ask_llama_async(job_prompt, api_semaphore)

                        if job_result.get("has_job_listings") and job_result.get("job_listings"):
                            jobs_found = job_result["job_listings"]
                            career_url_found = link['url']
                            for job in jobs_found:
                                if 'company' not in job:
                                    job['company'] = company
                            logger.info(f"[{company}] JOBS FOUND! {len(jobs_found)} jobs at {career_url_found}")
                            break  # EARLY EXIT: jobs found

                        # Try clicking "Get Info" or similar buttons
                        buttons = await page.query_selector_all("button, a")
                        for btn in buttons:
                            btn_text = (await btn.inner_text()).strip().lower()
                            if any(keyword in btn_text for keyword in ["get info", "show jobs", "view jobs", "see jobs", "open positions", "see openings"]):
                                try:
                                    await btn.click()
                                    await asyncio.sleep(1)
                                    clicked_html = await page.content()
                                    job_sections2 = extract_job_sections(clicked_html)
                                    job_content2 = " ".join(job_sections2)[:8000]
                                    job_prompt2 = PROMPT_JOB_DISCOVERY.format(content=job_content2)
                                    job_result2 = await ask_llama_async(job_prompt2, api_semaphore)
                                    if job_result2.get("has_job_listings") and job_result2.get("job_listings"):
                                        jobs_found = job_result2["job_listings"]
                                        career_url_found = link['url']
                                        for job in jobs_found:
                                            if 'company' not in job:
                                                job['company'] = company
                                        logger.info(f"[{company}] JOBS FOUND after clicking! {len(jobs_found)} jobs at {career_url_found}")
                                        break
                                except Exception:
                                    continue
                        if jobs_found:
                            break  # EARLY EXIT: jobs found

                    except Exception:
                        continue

                result = {
                    "company": company,
                    "homepage_url": homepage_url,
                    "career_url": career_url_found or "",
                    "total": len(jobs_found),
                    "jobs": jobs_found,
                    "links_visited": links_visited,
                    "status": "success",
                    "timestamp": time.time()
                }
                return result

            except Exception as e:
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(2 ** attempt)
                    continue
                else:
                    return {
                        "company": company,
                        "homepage_url": homepage_url,
                        "career_url": "",
                        "total": 0,
                        "jobs": [],
                        "links_visited": links_visited,
                        "status": "failed",
                        "error": str(e),
                        "timestamp": time.time()
                    }
            finally:
                if page:
                    await page.close()

# --- Batch Processing ---
async def process_company_batch(browser: Browser, companies_batch: List[tuple], 
                              browser_semaphore: asyncio.Semaphore,
                              api_semaphore: asyncio.Semaphore) -> List[Dict]:
    """Process a batch of companies concurrently"""
    logger.info(f"Processing batch of {len(companies_batch)} companies...")
    
    tasks = []
    for company, url in companies_batch:
        task = process_company(browser, company, url, browser_semaphore, api_semaphore)
        tasks.append(task)
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    processed_results = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            company, url = companies_batch[i]
            logger.error(f"[{company}] Unhandled exception: {result}")
            processed_results.append({
                "company": company,
                "homepage_url": url,
                "career_url": "",
                "total": 0,
                "jobs": [],
                "links_visited": 0,
                "status": "error",
                "error": str(result),
                "timestamp": time.time()
            })
        else:
            processed_results.append(result)
    
    return processed_results

# --- Save Results ---
async def save_results(results: List[Dict]):
    """Save results to individual JSON files and create summary"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    summary = {
        "total_companies": len(results),
        "successful": 0,
        "failed": 0,
        "companies_with_jobs": 0,
        "total_jobs": 0,
        "total_links_visited": 0,
        "companies": [],
        "timestamp": time.time()
    }
    
    for result in results:
        # Save individual company file
        safe_filename = re.sub(r'[^a-zA-Z0-9_-]', '_', result['company'].lower())
        filename = f"{safe_filename}.json"
        output_path = f"{OUTPUT_DIR}/{filename}"
        
        async with aiofiles.open(output_path, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(result, indent=2, ensure_ascii=False))
        
        # Update summary statistics
        if result['status'] == 'success':
            summary['successful'] += 1
            summary['total_jobs'] += result['total']
            summary['total_links_visited'] += result.get('links_visited', 0)
            if result['total'] > 0:
                summary['companies_with_jobs'] += 1
        else:
            summary['failed'] += 1
        
        summary['companies'].append({
            "name": result['company'],
            "status": result['status'],
            "jobs_found": result['total'],
            "career_url": result.get('career_url', ''),
            "links_visited": result.get('links_visited', 0),
            "file": filename,
            "homepage_url": result.get('homepage_url', '')
        })
        
        status_emoji = "SUCCESS" if result['total'] > 0 else "WARNING" if result['status'] == 'success' else "ERROR"
        logger.info(f"SAVED [{status_emoji}] [{result['company']}] {result['total']} jobs, {result.get('links_visited', 0)} links visited")
    
    # Save summary report
    async with aiofiles.open(f"{OUTPUT_DIR}/summary.json", 'w', encoding='utf-8') as f:
        await f.write(json.dumps(summary, indent=2, ensure_ascii=False))
    
    # Print final summary
    logger.info(f"\nFINAL SUMMARY:")
    logger.info(f"   Companies processed: {summary['total_companies']}")
    logger.info(f"   Successful: {summary['successful']}")
    logger.info(f"   Failed: {summary['failed']}")
    logger.info(f"   Companies with jobs found: {summary['companies_with_jobs']}")
    logger.info(f"   Total jobs found: {summary['total_jobs']}")
    logger.info(f"   Total links visited: {summary['total_links_visited']}")
    logger.info(f"   Average links per company: {summary['total_links_visited'] / max(summary['successful'], 1):.1f}")

# --- Main Execution ---
async def main():
    """Main function with optimized batch processing"""
    start_time = time.time()
    
    logger.info("Starting merged LLaMA career page and job scraper...")
    logger.info(f"Configuration: CHUNK_SIZE={CHUNK_SIZE}, MAX_LINKS_TO_VISIT={MAX_LINKS_TO_VISIT}")
    
    # Check if Ollama server is running
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:11434") as response:
                if response.status != 200:
                    logger.error("Error: Ollama server not running at http://localhost:11434")
                    return
    except Exception as e:
        logger.error(f"Error connecting to Ollama server: {e}")
        logger.info("Please ensure Ollama is installed and running with: ollama run llama3.2:latest")
        return
    
    # Load companies from CSV
    try:
        df = pd.read_csv(INPUT_CSV)
        logger.info(f"Loaded CSV with columns: {df.columns.tolist()}")
    except FileNotFoundError:
        logger.error(f"{INPUT_CSV} not found!")
        return
    except Exception as e:
        logger.error(f"Error reading CSV: {e}")
        return
    
    # Prepare company list (deduplicate by name and homepage)
    seen = set()
    companies = []
    for idx, row in df.iterrows():
        company_name = str(row['Company Name']).strip()
        homepage_url = row['Homepage URL']
        key = (company_name.lower(), str(homepage_url).strip().lower())
        if key in seen:
            continue
        seen.add(key)
        if pd.notna(homepage_url) and homepage_url.strip():
            url = normalize_url(str(homepage_url).strip())
            if not url:
                logger.warning(f"Skipping {company_name}: Invalid URL format")
                continue
            companies.append((company_name, url))
        else:
            logger.warning(f"Skipping {company_name}: No valid homepage URL found")
    
    if not companies:
        logger.error("No valid companies found in CSV!")
        return
    
    logger.info(f"Processing {len(companies)} companies with chunk size {CHUNK_SIZE}")
    
    # Create semaphores for rate limiting
    browser_semaphore = asyncio.Semaphore(CHUNK_SIZE)
    api_semaphore = asyncio.Semaphore(2)  # Limit LLaMA API calls
    
    # Process companies in batches
    all_results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage']
        )
        
        try:
            for i in range(0, len(companies), CHUNK_SIZE):
                batch = companies[i:i + CHUNK_SIZE]
                batch_number = i // CHUNK_SIZE + 1
                total_batches = (len(companies) + CHUNK_SIZE - 1) // CHUNK_SIZE
                
                logger.info(f"\nProcessing batch {batch_number}/{total_batches}")
                logger.info(f"   Companies in this batch: {[comp[0] for comp in batch]}")
                
                batch_start_time = time.time()
                batch_results = await process_company_batch(
                    browser, batch, browser_semaphore, api_semaphore
                )
                batch_time = time.time() - batch_start_time
                
                all_results.extend(batch_results)
                
                logger.info(f"Batch {batch_number} completed in {batch_time:.2f}s")
                
                # Brief pause between batches
                if i + CHUNK_SIZE < len(companies):
                    await asyncio.sleep(1)
        
        finally:
            await browser.close()
    
    # Save all results
    await save_results(all_results)
    
    # Final timing information
    total_time = time.time() - start_time
    logger.info(f"\nPERFORMANCE METRICS:")
    logger.info(f"   Total execution time: {total_time:.2f} seconds")
    logger.info(f"   Average time per company: {total_time/len(companies):.2f} seconds")
    logger.info(f"   Companies per minute: {len(companies) / (total_time / 60):.1f}")

if __name__ == "__main__":
    logger.info("Starting merged LLaMA job scraper...")
    asyncio.run(main())