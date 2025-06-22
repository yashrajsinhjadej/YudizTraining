import asyncio
import json
import os
from datetime import datetime
from playwright.async_api import async_playwright

async def scrape_yc_companies():
    print("[DEBUG] Entered scrape_yc_companies()")
    companies = []
    async with async_playwright() as p:
        print("[DEBUG] Initializing browser...")
        browser = await p.chromium.launch(
            headless=False,
            slow_mo=100
        )
        page = await browser.new_page()
        await page.set_extra_http_headers({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        try:
            url ='https://www.ycombinator.com/companies'
            print(f"[DEBUG] Navigating to: {url}")
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)
            await page.wait_for_timeout(3000)
            print("[DEBUG] Auto-scrolling to load all companies...")
            await auto_scroll(page)
            print("[DEBUG] Extracting company information...")
            companies = await page.evaluate("""
    1                () => {
                    const results = [];
                    const links = document.querySelectorAll('a[class*="_company_"]');
                    links.forEach(link => {
                        const nameElem = link.querySelector('[class*="_coName_"]');
                        const name = nameElem ? nameElem.textContent.trim() : null;
                        let profileUrl = link.href || link.getAttribute('href');
                        if (profileUrl && !profileUrl.startsWith('http')) {
                            profileUrl = 'https://www.ycombinator.com' + profileUrl;
                        }
                        // New fields
                        let founded = '';
                        let batch = '';
                        let teamSize = '';
                        let status = '';
                        let primaryPartner = { name: '', url: '' };
                        // Try to extract from the card
                        const infoDivs = link.querySelectorAll('div.flex.flex-row.justify-between');
                        infoDivs.forEach(div => {
                            const spans = div.querySelectorAll('span');
                            if (spans.length === 2) {
                                const label = spans[0].textContent.trim().toLowerCase();
                                const value = spans[1].textContent.trim();
                                if (label.includes('founded')) founded = value;
                                if (label.includes('batch')) batch = value;
                                if (label.includes('team size')) teamSize = value;
                                if (label.includes('status')) status = value;
                            }
                        });
                        // Primary Partner
                        const partnerDiv = link.querySelector('div.flex.flex-row.justify-between a.text-linkColor');
                        if (partnerDiv) {
                            primaryPartner.name = partnerDiv.textContent.trim();
                            primaryPartner.url = partnerDiv.href;
                        }
                        if (name && profileUrl) {
                            results.push({
                                name,
                                profileUrl,
                                founded,
                                batch,
                                teamSize,
                                status,
                                primaryPartner
                            });
                        }
                    });
                    return results;
                }
            """)
            print(f"[DEBUG] Extracted {len(companies)} companies.")
        except Exception as e:
            print(f"[ERROR] Error during scraping: {e}")
        finally:
            print("[DEBUG] Closing browser...")
            await browser.close()
    print("[DEBUG] Exiting scrape_yc_companies()")
    return companies

async def auto_scroll(page):
    print("[DEBUG] Entered auto_scroll()")
    await page.evaluate("""
        async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        }
    """)
    await page.wait_for_timeout(2000)
    print("[DEBUG] Exiting auto_scroll()")

def save_results(companies, filename=None):
    print(f"[DEBUG] Entered save_results() with {len(companies)} companies")
    if not companies:
        print("[DEBUG] No companies to save")
        return
    # Always save to results/companies.json
    os.makedirs('results', exist_ok=True)
    filename = 'results/companies.json'
    print(f"[DEBUG] Saving JSON to {filename}")
    with open('results/companies.json', 'w', encoding='utf-8') as f:
        json.dump(companies, f, ensure_ascii=False, indent=2)
    print(f"[DEBUG] Results saved to {filename}")
    print("[DEBUG] Exiting save_results()")

def display_results(companies):
    print("[DEBUG] Entered display_results()")
    if not companies:
        print("[DEBUG] No companies found")
        return
    print("\nSCRAPED COMPANIES:")
    print("=" * 50)
    for i, company in enumerate(companies, 1):
        print(f"{i}. {company['name']}")
        if company.get('profileUrl'):
            print(f"   Link: {company['profileUrl']}")
        print()
    print("[DEBUG] Exiting display_results()")

async def main():
    print("[DEBUG] Entered main()")
    try:
        print("[DEBUG] Starting Y Combinator SaaS B2B Company Scraper...")
        companies = await scrape_yc_companies()
        display_results(companies)
        save_results(companies)
        print(f"\n[DEBUG] Scraping completed! Found {len(companies)} SaaS B2B companies from Y Combinator.")
    except Exception as e:
        print(f"[ERROR] Scraping failed: {str(e)}")
    print("[DEBUG] Exiting main()")

if __name__ == "__main__":
    print("[DEBUG] Running as main script")
    asyncio.run(main())
