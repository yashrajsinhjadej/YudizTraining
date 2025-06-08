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
CHUNK_SIZE = 5  # Number of companies to process in each batch
MAX_RETRIES = 2  # Maximum retries for failed operations
TIMEOUT_SECONDS = 30  # Total time allowed per company
DELAY_BETWEEN_REQUESTS = 1.0  # Delay between requests
OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Ollama API endpoint
LLAMA_MODEL = "llama3.2:latest"  # LLaMA model
INPUT_CSV = 'baki.csv'
OUTPUT_CSV = 'done.csv'
OUTPUT_DIR = 'job_data'
MAX_LINKS_TO_VISIT = 10000 # Maximum links to check per compan

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
    logger = logging.getLogger('career_finder')
    logger.setLevel(logging.INFO)
    
    file_handler = RotatingFileHandler(
        'career_finder.log',
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

# --- LLaMA Prompt Setup ---
PROMPT_CAREER_DISCOVERY = """
Analyze the following webpage content to determine if it is a career or job listings page.
Look for indicators such as job titles, position descriptions, application buttons, or keywords like jobs, careers, openings, vacancies, positions, apply, hiring.

Content:
{content}

Return a JSON object with:
1. "is_career_page": boolean (true if the page contains job listings or career-related content, false otherwise)
2. "explanation": string (brief explanation of why it is or isn't a career page)

JSON Response:
"""

# --- Async LLaMA Query with Rate Limiting ---
async def ask_llama_async(prompt: str, semaphore: asyncio.Semaphore) -> Dict:
    """Async LLaMA API call with rate limiting and error handling"""
    async with semaphore:
        try:
            logger.info(f"Sending prompt to LLaMA (length: {len(prompt)} chars)")
            
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
                        return {"is_career_page": False, "explanation": f"API request failed with status {response.status}"}
                    
                    full_response = await response.text()
                    response_data = json.loads(full_response)
                    
                    if not response_data.get("response"):
                        logger.warning("LLaMA returned empty response")
                        return {"is_career_page": False, "explanation": "Empty response from LLaMA"}
                    
                    logger.info(f"LLaMA response received (length: {len(full_response)} chars)")
                    
                    response_text = response_data["response"].strip()
                    
                    try:
                        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                        if json_match:
                            json_str = json_match.group(0)
                            parsed_json = json.loads(json_str)
                            logger.info(f"Successfully parsed JSON: {parsed_json}")
                            return parsed_json
                        else:
                            logger.error("No JSON object found in LLaMA response")
                            logger.debug(f"Response preview: {response_text[:300]}...")
                            return {"is_career_page": False, "explanation": "No valid JSON in response"}
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON decode error: {e}")
                        logger.debug(f"JSON string preview: {response_text[:300]}...")
                        return {"is_career_page": False, "explanation": "Invalid JSON format"}
                
        except Exception as e:
            logger.error(f"LLaMA API error: {e}")
            return {"is_career_page": False, "explanation": str(e)}

# --- HTML Parsing ---
def extract_visible_sections(html: str, base_url: str) -> Dict:
    """Extract job-related sections and links from HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    
    for element in soup(["script", "style"]):
        element.decompose()
    
    content = {
        'header': {'text': '', 'links': []},
        'footer': {'text': '', 'links': []},
        'body': {'text': '', 'links': []}
    }
    
    header = soup.find(['header', 'nav'])
    if header:
        content['header'] = extract_text_with_links(header, base_url)
    
    footer = soup.find('footer')
    if footer:
        content['footer'] = extract_text_with_links(footer, base_url)
    
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

# --- Normalize URL ---
def normalize_url(url: str) -> str:
    """Normalize malformed URLs (e.g., httpswww.yudiz.com -> https://www.yudiz.com)"""
    url = url.strip()
    if not url:
        return ""
    
    # Handle cases like httpswww.yudiz.com
    if url.startswith('https') and not url.startswith('https://'):
        url = url.replace('https', 'https://', 1)
    elif url.startswith('http') and not url.startswith('http://'):
        url = url.replace('http', 'http://', 1)
    elif not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Remove any duplicate slashes
    url = re.sub(r'https?:///+', 'https://', url)
    
    return url

# --- Single Company Career Page Extraction ---
async def find_career_link(browser: Browser, company: str, url: str, 
                          browser_semaphore: asyncio.Semaphore, 
                          api_semaphore: asyncio.Semaphore) -> Dict:
    """Find career page URL for a single company by visiting potential links"""
    async with browser_semaphore:
        for attempt in range(MAX_RETRIES + 1):
            page = None
            try:
                logger.info(f"[{company}] Attempt {attempt + 1}: Navigating to {url}")
                
                page = await browser.new_page()
                await page.set_extra_http_headers({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                })
                
                await page.goto(url, wait_until='domcontentloaded', timeout=TIMEOUT_SECONDS * 1000)
                await asyncio.sleep(DELAY_BETWEEN_REQUESTS)
                
                html = await page.content()
                logger.info(f"[{company}] Page loaded successfully, extracting content...")
                
                base_url = url.rstrip('/')
                sections = extract_visible_sections(html, base_url)
                
                # Collect potential career links
                potential_links = []
                
                # Strategy 1: Check URL patterns
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
                            'confidence': 0.9,
                            'method': 'pattern_match',
                            'source': 'pattern'
                        })
                
                # Strategy 2: Extract links from sections
                for section_name, section_content in sections.items():
                    for link in section_content['links']:
                        if JOB_KEYWORD_PATTERN.search(link['href']) or JOB_KEYWORD_PATTERN.search(link['text']):
                            confidence = 0.7 if section_name in ['header', 'footer'] else 0.5
                            potential_links.append({
                                'url': link['href'],
                                'confidence': confidence,
                                'method': f"{section_name}_link",
                                'source': section_name
                            })
                
                # Remove duplicates and limit links
                seen_urls = set()
                unique_links = []
                for link in potential_links:
                    if link['url'] not in seen_urls and len(unique_links) < MAX_LINKS_TO_VISIT:
                        unique_links.append(link)
                        seen_urls.add(link['url'])
                
                # Sort by confidence
                unique_links.sort(key=lambda x: x['confidence'], reverse=True)
                
                # Visit each link to validate
                career_url = None
                for link in unique_links:
                    try:
                        logger.info(f"[{company}] Checking potential career link: {link['url']} (method: {link['method']})")
                        await page.goto(link['url'], wait_until='domcontentloaded', timeout=15000)
                        link_html = await page.content()
                        
                        sections = extract_visible_sections(link_html, link['url'])
                        full_content = ' '.join(
                            section['text'] for section in sections.values() if section['text']
                        )[:8000]  # Limit to 8,000 chars for LLaMA
                        
                        prompt = PROMPT_CAREER_DISCOVERY.format(content=full_content)
                        result = await ask_llama_async(prompt, api_semaphore)
                        
                        if result.get("is_career_page"):
                            logger.info(f"[{company}] Confirmed career page: {link['url']} - {result.get('explanation')}")
                            career_url = link['url']
                            break
                    except Exception as e:
                        logger.debug(f"[{company}] Failed to check link {link['url']}: {e}")
                        continue
                
                result = {
                    "company": company,
                    "homepage_url": url,
                    "career_url": career_url or "",
                    "status": "success" if career_url else "no_career_page",
                    "timestamp": time.time()
                }
                
                logger.info(f"[{company}] Result: {'Found career URL: ' + career_url if career_url else 'No career page found'}")
                return result
                
            except Exception as e:
                logger.error(f"[{company}] Attempt {attempt + 1} failed: {str(e)}")
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(2 ** attempt)
                    continue
                return {
                    "company": company,
                    "homepage_url": url,
                    "career_url": "",
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
        task = find_career_link(browser, company, url, browser_semaphore, api_semaphore)
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
                "status": "error",
                "error": str(result),
                "timestamp": time.time()
            })
        else:
            processed_results.append(result)
    
    return processed_results

# --- Save Results ---
async def save_results(results: List[Dict]):
    """Save results to CSV and create summary JSON"""
    os.makedirs(os.path.dirname(OUTPUT_CSV) if os.path.dirname(OUTPUT_CSV) else '.', exist_ok=True)  # Create directory for done.csv
    os.makedirs(OUTPUT_DIR, exist_ok=True)  # Create job_data directory
    
    summary = {
        "total_companies": len(results),
        "successful": 0,
        "failed": 0,
        "jobs_found": 0,  # Companies with non-empty career_url
        "companies": [],
        "timestamp": time.time()
    }
    
    csv_data = [
        {
            "Company Name": result["company"],
            "Homepage URL": result["homepage_url"],
            "Career Page URL": result["career_url"]
        }
        for result in results
    ]
    df = pd.DataFrame(csv_data)
    mode = 'a' if os.path.exists(OUTPUT_CSV) else 'w'
    header = not os.path.exists(OUTPUT_CSV)
    df.to_csv(OUTPUT_CSV, mode=mode, header=header, index=False)
    
    for result in results:
        if result['status'] == 'success':
            summary['successful'] += 1
            if result['career_url']:
                summary['jobs_found'] += 1
        elif result['status'] == 'failed':
            summary['failed'] += 1
        
        summary['companies'].append({
            "name": result['company'],
            "status": result['status'],
            "career_url": result["career_url"],
            "homepage_url": result["homepage_url"]
        })
        
        status_emoji = "✅" if result['status'] == 'success' and result['career_url'] else "⚠️" if result['status'] == 'success' else "❌"
        logger.info(f"{status_emoji} [{result['company']}] Saved: {'Career URL: ' + result['career_url'] if result['career_url'] else 'No career page'}")
    
    async with aiofiles.open(f"{OUTPUT_DIR}/summary.json", 'w', encoding='utf-8') as f:
        await f.write(json.dumps(summary, indent=2, ensure_ascii=False))
    
    logger.info(f"\n📊 BATCH SUMMARY:")
    logger.info(f"   Companies processed: {summary['total_companies']}")
    logger.info(f"   Successful: {summary['successful']}")
    logger.info(f"   Failed: {summary['failed']}")
    logger.info(f"   Companies with career pages found: {summary['jobs_found']}")

# --- Main Execution ---
async def main():
    """Main function with optimized batch processing"""
    start_time = time.time()
    
    logger.info("Starting LLaMA-powered career page scraper...")
    logger.info(f"Configuration: CHUNK_SIZE={CHUNK_SIZE}, MAX_RETRIES={MAX_RETRIES}")
    
    # Check Ollama server
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:11434") as response:
                if response.status != 200:
                    logger.error("Ollama server not running at http://localhost:11434")
                    logger.info("Please ensure Ollama is installed and running with: ollama run llama3.2:latest")
                    return
    except Exception as e:
        logger.error(f"Error connecting to Ollama server: {e}")
        logger.info("Please ensure Ollama is installed and running with: ollama run llama3.2:latest")
        return
    
    # Load companies
    try:
        df = pd.read_csv(INPUT_CSV, sep='\t')
        logger.info(f"Loaded CSV with columns: {df.columns.tolist()}")
        
        # Validate required columns
        required_columns = ['Company Name', 'Homepage URL']
        if not all(col in df.columns for col in required_columns):
            logger.error(f"Input CSV {INPUT_CSV} missing required columns: {required_columns}")
            return
    except FileNotFoundError:
        logger.error(f"Input CSV {INPUT_CSV} not found!")
        return
    except Exception as e:
        logger.error(f"Error reading input CSV: {e}")
        return
    
    # Skip already processed companies
    processed_companies = set()
    if os.path.exists(OUTPUT_CSV) and os.path.getsize(OUTPUT_CSV) > 0:
        try:
            processed_df = pd.read_csv(OUTPUT_CSV)
            if 'Company Name' in processed_df.columns:
                processed_companies = set(processed_df['Company Name'].dropna().astype(str).tolist())
            else:
                logger.warning(f"Output CSV {OUTPUT_CSV} exists but has no 'Company Name' column. Treating as empty.")
        except (pd.errors.EmptyDataError, pd.errors.ParserError) as e:
            logger.warning(f"Output CSV {OUTPUT_CSV} is empty or malformed: {e}. Treating as empty.")
    
    companies = []
    for _, row in df.iterrows():
        company_name = str(row['Company Name']).strip()
        if company_name in processed_companies:
            logger.info(f"Skipping already processed company: {company_name}")
            continue
        
        homepage_url = row['Homepage URL']
        if pd.notna(homepage_url) and homepage_url.strip():
            url = normalize_url(str(homepage_url).strip())
            if not url:
                logger.warning(f"Skipping {company_name}: Invalid URL format")
                continue
            companies.append((company_name, url))
        else:
            logger.warning(f"Skipping {company_name}: No valid URL found")
    
    if not companies:
        logger.info("No companies to process!")
        return
    
    logger.info(f"Processing {len(companies)} companies with chunk size {CHUNK_SIZE}")
    
    # Process companies in batches
    browser_semaphore = asyncio.Semaphore(CHUNK_SIZE)
    api_semaphore = asyncio.Semaphore(2)
    
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
                logger.info(f"Companies in this batch: {[comp[0] for comp in batch]}")
                
                batch_start_time = time.time()
                batch_results = await process_company_batch(
                    browser, batch, browser_semaphore, api_semaphore
                )
                batch_time = time.time() - batch_start_time
                
                all_results.extend(batch_results)
                
                await save_results(batch_results)
                
                logger.info(f"Batch {batch_number} completed in {batch_time:.2f}s")
                
                if i + CHUNK_SIZE < len(companies):
                    await asyncio.sleep(1)
        
        finally:
            await browser.close()
    
    # Final summary
    await save_results(all_results)
    
    total_time = time.time() - start_time
    logger.info(f"\n⏱️ PERFORMANCE METRICS:")
    logger.info(f"   Total execution time: {total_time:.2f} seconds")
    logger.info(f"   Average time per company: {total_time/len(companies):.2f} seconds")
    logger.info(f"   Companies per minute: {len(companies) / (total_time / 60):.1f}")

if __name__ == "__main__":
    asyncio.run(main())