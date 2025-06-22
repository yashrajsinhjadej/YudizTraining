import asyncio
import json
from playwright.async_api import async_playwright, Page

INPUT_JSON = 'results/clutch_companies.json'
OUTPUT_JSON = 'results/clutch_companies.json'

CONCURRENT_TASKS = 10
STAGGER_DELAY = 0.25

async def process_company(browser, company):
    # Placeholder for enrichment logic
    return company

async def enrich_companies():
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        companies = json.load(f)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        semaphore = asyncio.Semaphore(CONCURRENT_TASKS)

        async def sem_task(company, idx):
            await asyncio.sleep(idx * STAGGER_DELAY)
            async with semaphore:
                return await process_company(browser, company)

        tasks = [sem_task(company, idx) for idx, company in enumerate(companies)]
        enriched_companies = await asyncio.gather(*tasks)
        await browser.close()

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(enriched_companies, f, ensure_ascii=False, indent=2)
    print(f"\nEnrichment complete. Results saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    asyncio.run(enrich_companies())
