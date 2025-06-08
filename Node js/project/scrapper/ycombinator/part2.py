import asyncio
import csv
import random
import pandas as pd
from playwright.async_api import async_playwright, Page

INPUT_CSV = 'part1.csv'
OUTPUT_CSV = 'demo100.csv'
CONCURRENT_TASKS =50  # Number of pages to run in parallel
STAGGER_DELAY = 0.25   # Seconds between each launch (first 50 or 100)

async def route_intercept(route):
    if route.request.resource_type in ["image", "stylesheet", "font"]:
        await route.abort()
    else:
        await route.continue_()

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
                        'linkedinUrl': linkedin or '',
                        'website': website or ''
                    })
            except Exception:
                continue

        return extracted
    except Exception as e:
        print(f"Error loading {url}: {e}")
        return []

async def process_row(browser, row):
    page = await browser.new_page()
    await page.route("**/*", route_intercept)

    name = row['Name']
    profile_url = row['Profile URL']
    print(f"Scraping {name} - {profile_url}")

    founder_data = await extract_details(page, profile_url)
    await page.close()

    if not founder_data:
        return [{
            'name': name,
            'profileUrl': profile_url,
            'website': '',
            'founderName': '',
            'linkedinUrl': ''
        }]
    else:
        results = []
        for founder in founder_data:
            results.append({
                'name': name,
                'profileUrl': profile_url,
                **founder
            })
        return results

async def enrich_companies():
    df = pd.read_csv(INPUT_CSV)
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        semaphore = asyncio.Semaphore(CONCURRENT_TASKS)

        async def sem_task(row, idx):
            await asyncio.sleep(idx * STAGGER_DELAY)  # staggered start
            async with semaphore:
                return await process_row(browser, row)

        tasks = [sem_task(row, idx) for idx, row in df.iterrows()]
        all_results = await asyncio.gather(*tasks)

        await browser.close()

    for res in all_results:
        results.extend(res)

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'profileUrl', 'website', 'founderName', 'linkedinUrl'])
        writer.writeheader()
        writer.writerows(results)

    print(f"\nScraping complete. Results saved to {OUTPUT_CSV}")

if __name__ == "__main__":
    asyncio.run(enrich_companies())
