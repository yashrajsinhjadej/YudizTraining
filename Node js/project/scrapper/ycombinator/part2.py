import asyncio
import json
from playwright.async_api import async_playwright, Page

INPUT_JSON = 'results/companies.json'
OUTPUT_JSON = 'results/companies.json'

CONCURRENT_TASKS = 50  # Number of pages to run in parallel
STAGGER_DELAY = 0.25   # Seconds between each launch

async def route_intercept(route):
    if route.request.resource_type in ["image", "stylesheet", "font"]:
        await route.abort()
    else:
        await route.continue_()

async def extract_job_details(page: Page):
    """Extract job listings from the page"""
    jobs = []
    try:
        # Find all job listing containers
        job_containers = await page.locator('div.flex.w-full.flex-row.justify-between.border-b.py-4').all()
        
        for container in job_containers:
            try:
                # Extract job title and link
                title_element = await container.locator('div.ycdc-with-link-color a').first
                job_title = await title_element.text_content()
                job_link = await title_element.get_attribute('href')
                
                # Extract location and experience
                details_container = await container.locator('div.justify-left.flex.flex-row.flex-wrap.gap-x-4.gap-y-2')
                detail_items = await details_container.locator('div').all()
                
                location = ''
                experience = ''
                
                for item in detail_items:
                    text = await item.text_content()
                    text = text.strip()
                    if 'remote' in text.lower() or 'onsite' in text.lower() or 'hybrid' in text.lower():
                        location = text
                    elif 'year' in text.lower() or 'month' in text.lower():
                        experience = text.replace('•', '').strip()
                
                # Extract apply link
                apply_element = await container.locator('div.APPLY a').first
                apply_link = await apply_element.get_attribute('href') if apply_element else ''
                
                if job_title:
                    jobs.append({
                        'jobTitle': job_title.strip(),
                        'jobLink': job_link.strip() if job_link else '',
                        'location': location,
                        'experience': experience,
                        'applyLink': apply_link
                    })
                    
            except Exception as e:
                print(f"Error extracting job details: {e}")
                continue
                
    except Exception as e:
        print(f"Error finding job containers: {e}")
    
    return jobs

async def extract_details(page: Page, url: str):
    try:
        await page.goto(url, wait_until='networkidle', timeout=30000)
        await page.route("**/*", route_intercept)

        website = await page.locator('div.group.flex.flex-row.items-center >> a').get_attribute('href')
        founders = await page.locator('div.ycdc-card-new').all()
        extracted = []

        for founder in founders:
            try:
                name = await founder.locator('div.text-xl.font-bold').text_content()
                name = name.strip() if name else ''
                linkedin = await founder.locator('a[href*="linkedin.com/in/"]').get_attribute('href')
                linkedin = linkedin.strip() if linkedin else ''

                if name:
                    extracted.append({
                        'founderName': name,
                        'linkedinUrl': linkedin or ''
                    })
            except Exception:
                continue

        # Extract jobs using the full jobs section
        jobs = []
        # Find the parent section for jobs
        job_section = await page.query_selector('section:has-text("Jobs at")')
        if job_section:
            job_divs = await job_section.query_selector_all('div.flex.w-full.flex-row.justify-between.border-b.py-4')
            for job_div in job_divs:
                try:
                    # Job title and link
                    title_elem = await job_div.query_selector('a')
                    title = await title_elem.text_content() if title_elem else ''
                    title = title.strip() if title else ''
                    job_link = await title_elem.get_attribute('href') if title_elem else ''
                    # Location and experience
                    info_div = await job_div.query_selector('div.justify-left.flex.flex-row.flex-wrap')
                    location = ''
                    experience = ''
                    if info_div:
                        info_spans = await info_div.query_selector_all('div')
                        if len(info_spans) > 0:
                            location = await info_spans[0].text_content() or ''
                            location = location.strip()
                        if len(info_spans) > 1:
                            experience = await info_spans[1].text_content() or ''
                            experience = experience.strip()
                    # Apply link
                    apply_elem = await job_div.query_selector('a.ycdc-btn')
                    apply_link = await apply_elem.get_attribute('href') if apply_elem else ''
                    jobs.append({
                        'title': title,
                        'job_link': job_link,
                        'location': location,
                        'experience': experience,
                        'apply_link': apply_link
                    })
                except Exception:
                    continue

        return website, extracted, jobs
    except Exception as e:
        print(f"Error loading {url}: {e}")
        return '', [], []

async def process_company(browser, company):
    page = await browser.new_page()
    await page.route("**/*", route_intercept)

    name = company.get('name')
    profile_url = company.get('profileUrl')
    print(f"Scraping {name} - {profile_url}")

    website, founders, jobs = await extract_details(page, profile_url)
    await page.close()

    company['website'] = website or ''
    company['founders'] = founders
    company['jobs'] = jobs
    return company

async def enrich_companies():
    # Read companies from JSON
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        semaphore = asyncio.Semaphore(CONCURRENT_TASKS)
        
        async def sem_task(company, idx):
            await asyncio.sleep(idx * STAGGER_DELAY)  # staggered start
            async with semaphore:
                return await process_company(browser, company)
        
        tasks = [sem_task(company, idx) for idx, company in enumerate(companies)]
        enriched_companies = await asyncio.gather(*tasks)
        
        await browser.close()
    
    # Save enriched companies back to JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(enriched_companies, f, ensure_ascii=False, indent=2)
    
    # Print summary
    total_jobs = sum(len(company.get('jobs', [])) for company in enriched_companies)
    print(f"\nEnrichment complete. Results saved to {OUTPUT_JSON}")
    print(f"Total companies processed: {len(enriched_companies)}")
    print(f"Total jobs extracted: {total_jobs}")

if __name__ == "__main__":
    asyncio.run(enrich_companies())