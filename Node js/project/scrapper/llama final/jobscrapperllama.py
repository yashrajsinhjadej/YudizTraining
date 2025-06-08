import asyncio
import json
import os
from typing import List, Dict
import time
import re
from contextlib import asynccontextmanager
import aiohttp
from playwright.async_api import async_playwright, Browser
from bs4 import BeautifulSoup
import aiofiles
import pandas as pd

# --- Configuration ---
CHUNK_SIZE = 5  # Reduced chunk size for local LLaMA processing
MAX_RETRIES = 2  # Maximum retries for failed requests
TIMEOUT_SECONDS = 60  # Page load timeout
DELAY_BETWEEN_REQUESTS = 1.0  # Increased delay to avoid overloading local server
OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Default Ollama API endpoint
LLAMA_MODEL = "llama3.2:latest"  # LLaMA model to use
Input_csv="company2.csv"  # Input CSV file with company data
# --- LLaMA Prompt Setup ---
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
- Only include actual job listings, not general company information
- If a field is not available, omit it from the JSON
- Return valid JSON format only
- If no job listings are found, return {{"has_job_listings": false, "job_listings": []}}

JSON Response:
"""

# --- Async LLaMA Query with Rate Limiting ---
async def ask_llama_async(prompt: str, semaphore: asyncio.Semaphore) -> Dict:
    """Async LLaMA API call with rate limiting and error handling"""
    async with semaphore:  # Control API rate limiting
        try:
            print(f"🤖 Sending prompt to LLaMA (length: {len(prompt)} chars)")
            
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": LLAMA_MODEL,
                    "prompt": prompt,
                    "format": "json",  # Request JSON response
                    "stream": False,
                    "options": {
                        "temperature": 0.1,  # Low temperature for consistent JSON output
                        "max_tokens": 2048,
                    }
                }
                
                async with session.post(OLLAMA_API_URL, json=payload, timeout=60) as response:
                    if response.status != 200:
                        print(f"❌ LLaMA API error: HTTP {response.status}")
                        return {"has_job_listings": False, "job_listings": []}
                    
                    full_response = await response.text()
                    response_data = json.loads(full_response)
                    
                    if not response_data.get("response"):
                        print("⚠️ LLaMA returned empty response")
                        return {"has_job_listings": False, "job_listings": []}
                    
                    print(f"📄 LLaMA response received (length: {len(full_response)} chars)")
                    
                    # Clean up the response and extract JSON
                    response_text = response_data["response"].strip()
                    
                    # Try to extract JSON from response
                    try:
                        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                        if json_match:
                            json_str = json_match.group(0)
                            parsed_json = json.loads(json_str)
                            print(f"✅ Successfully parsed JSON with {len(parsed_json.get('job_listings', []))} jobs")
                            return parsed_json
                        else:
                            print("❌ No JSON object found in LLaMA response")
                            print(f"📝 Response preview: {response_text[:300]}...")
                            return {"has_job_listings": False, "job_listings": []}
                    except json.JSONDecodeError as e:
                        print(f"❌ JSON decode error: {e}")
                        print(f"📝 JSON string preview: {response_text[:300]}...")
                        return {"has_job_listings": False, "job_listings": []}
                
        except Exception as e:
            print(f"❌ LLaMA API error: {e}")
            return {"has_job_listings": False, "job_listings": []}

# --- HTML Parsing ---
def extract_visible_sections(html: str) -> List[str]:
    """Extract job-related sections from HTML"""
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

# --- Single Company Job Extraction ---
async def fetch_and_extract_jobs(browser: Browser, company: str, url: str, 
                                browser_semaphore: asyncio.Semaphore, 
                                api_semaphore: asyncio.Semaphore) -> Dict:
    """Extract jobs for a single company with controlled concurrency"""
    async with browser_semaphore:  # Limit concurrent browser operations
        for attempt in range(MAX_RETRIES + 1):
            page = None
            try:
                print(f"🔍 [{company}] Attempt {attempt + 1}: Navigating to {url}")
                
                # Create new page for this company
                page = await browser.new_page()
                
                # Set realistic headers
                await page.set_extra_http_headers({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                })
                
                # Navigate to page with timeout
                await page.goto(url, wait_until='domcontentloaded', timeout=TIMEOUT_SECONDS * 1000)
                await asyncio.sleep(DELAY_BETWEEN_REQUESTS)
                
                # Extract HTML content
                html = await page.content()
                
                print(f"✅ [{company}] Page loaded successfully, extracting content...")
                
                # Process HTML to extract job-related sections
                sections = extract_visible_sections(html)
                full_content = " ".join(sections)
                
                # Limit content size for API efficiency (LLaMA has smaller context window)
                content_for_api = full_content[:8000]  # Reduced for LLaMA
                prompt = PROMPT_JOB_DISCOVERY.format(content=content_for_api)
                
                # Query LLaMA API
                result = await ask_llama_async(prompt, api_semaphore)
                
                # Extract jobs from result
                all_jobs = []
                if result.get("has_job_listings") and result.get("job_listings"):
                    all_jobs = result["job_listings"]
                    # Ensure each job has the company name
                    for job in all_jobs:
                        if 'company' not in job:
                            job['company'] = company
                
                # Prepare final result
                company_result = {
                    "company": company,
                    "source": url,
                    "total": len(all_jobs),
                    "jobs": all_jobs,
                    "status": "success",
                    "timestamp": time.time(),
                    "processing_time": time.time()
                }
                
                print(f"💼 [{company}] Successfully found {len(all_jobs)} job(s)")
                return company_result
                
            except Exception as e:
                print(f"❌ [{company}] Attempt {attempt + 1} failed: {str(e)}")
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    continue
                else:
                    # All attempts failed
                    return {
                        "company": company,
                        "source": url,
                        "total": 0,
                        "jobs": [],
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
    print(f"🚀 Processing batch of {len(companies_batch)} companies...")
    
    tasks = []
    for company, url in companies_batch:
        task = fetch_and_extract_jobs(browser, company, url, browser_semaphore, api_semaphore)
        tasks.append(task)
    
    # Wait for all tasks in this batch to complete
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Handle any exceptions
    processed_results = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            company, url = companies_batch[i]
            print(f"❌ [{company}] Unhandled exception: {result}")
            processed_results.append({
                "company": company,
                "source": url,
                "total": 0,
                "jobs": [],
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
    os.makedirs("job_data", exist_ok=True)
    
    summary = {
        "total_companies": len(results),
        "successful": 0,
        "failed": 0,
        "jobs_found": 0,  # New field for companies with >0 jobs
        "total_jobs": 0,
        "companies": [],
        "timestamp": time.time()
    }
    
    for result in results:
        # Save individual company file
        safe_filename = re.sub(r'[^a-zA-Z0-9_-]', '_', result['company'].lower())
        filename = f"{safe_filename}.json"
        output_path = f"job_data/{filename}"
        
        async with aiofiles.open(output_path, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(result, indent=2, ensure_ascii=False))
        
        # Update summary statistics
        if result['status'] == 'success':
            summary['successful'] += 1
            summary['total_jobs'] += result['total']
            if result['total'] > 0:  # Increment jobs_found only if jobs exist
                summary['jobs_found'] += 1
        else:
            summary['failed'] += 1
        
        summary['companies'].append({
            "name": result['company'],
            "status": result['status'],
            "jobs_found": result['total'],  # Per company jobs found
            "file": filename,
            "url": result['source']
        })
        
        status_emoji = "✅" if result['status'] == 'success' else "❌"
        print(f"💾 {status_emoji} [{result['company']}] Saved to: {output_path}")
    
    # Save summary report
    async with aiofiles.open("job_data/summary.json", 'w', encoding='utf-8') as f:
        await f.write(json.dumps(summary, indent=2, ensure_ascii=False))
    
    # Print final summary
    print(f"\n📊 FINAL SUMMARY:")
    print(f"   Companies processed: {summary['total_companies']}")
    print(f"   Successful: {summary['successful']}")
    print(f"   Failed: {summary['failed']}")
    print(f"   Companies with jobs found: {summary['jobs_found']}")
    print(f"   Total jobs found: {summary['total_jobs']}")
    print(f"   Average jobs per successful company: {summary['total_jobs'] / max(summary['successful'], 1):.1f}")

# --- Main Execution ---
async def main():
    """Main function with optimized batch processing"""
    start_time = time.time()
    
    print("🚀 Starting LLaMA-powered job scraper...")
    print(f"🔧 Configuration: CHUNK_SIZE={CHUNK_SIZE}, MAX_RETRIES={MAX_RETRIES}")
    
    # Check if Ollama server is running
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:11434") as response:
                if response.status != 200:
                    print("❌ Error: Ollama server not running at http://localhost:11434")
                    return
    except Exception as e:
        print(f"❌ Error connecting to Ollama server: {e}")
        print("Please ensure Ollama is installed and running with: ollama run llama3.2:latest")
        return
    
    # Load companies from CSV
    try:
        df = pd.read_csv(Input_csv)
        print(f"📋 Loaded CSV with columns: {df.columns.tolist()}")
    except FileNotFoundError:
        print("❌ csv not found!")
        return
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return
    
    # Prepare company list
    companies = []
    for idx, row in df.iterrows():
        company_name = str(row['Company Name']).strip()
        
        # Prefer Career Page URL, fallback to Homepage URL
        career_url = row['Career Page URL'] if pd.notna(row['Career Page URL']) else row['Homepage URL']
        
        if pd.notna(career_url) and career_url.strip():
            url = str(career_url).strip()
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            companies.append((company_name, url))
        else:
            print(f"⚠️ Skipping {company_name}: No valid URL found")
    
    if not companies:
        print("❌ No valid companies found in CSV!")
        return
    
    print(f"🏢 Processing {len(companies)} companies with chunk size {CHUNK_SIZE}")
    
    # Create semaphores for rate limiting
    browser_semaphore = asyncio.Semaphore(CHUNK_SIZE)  # Limit browser operations
    api_semaphore = asyncio.Semaphore(2)  # Limit LLaMA API calls (local server is slower)
    
    # Process companies in batches
    all_results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage']  # Better compatibility
        )
        
        try:
            # Process in chunks
            for i in range(0, len(companies), CHUNK_SIZE):
                batch = companies[i:i + CHUNK_SIZE]
                batch_number = i // CHUNK_SIZE + 1
                total_batches = (len(companies) + CHUNK_SIZE - 1) // CHUNK_SIZE
                
                print(f"\n🔄 Processing batch {batch_number}/{total_batches}")
                print(f"   Companies in this batch: {[comp[0] for comp in batch]}")
                
                batch_start_time = time.time()
                batch_results = await process_company_batch(
                    browser, batch, browser_semaphore, api_semaphore
                )
                batch_time = time.time() - batch_start_time
                
                all_results.extend(batch_results)
                
                print(f"✅ Batch {batch_number} completed in {batch_time:.2f}s")
                
                # Brief pause between batches to be respectful
                if i + CHUNK_SIZE < len(companies):
                    await asyncio.sleep(1)
        
        finally:
            await browser.close()
    
    # Save all results
    await save_results(all_results)
    
    # Final timing information
    total_time = time.time() - start_time
    print(f"\n⏱️ PERFORMANCE METRICS:")
    print(f"   Total execution time: {total_time:.2f} seconds")
    print(f"   Average time per company: {total_time/len(companies):.2f} seconds")
    print(f"   Companies per minute: {len(companies) / (total_time / 60):.1f}")

if __name__ == "__main__":
    print("🔑 Starting LLaMA job scraper...")
    asyncio.run(main())