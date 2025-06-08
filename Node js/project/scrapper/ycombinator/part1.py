import asyncio
import json
import csv
from datetime import datetime
from playwright.async_api import async_playwright
import time

async def scrape_yc_companies():
    """
    Scrape SaaS B2B companies from Y Combinator directory
    """
    companies = []
    
    async with async_playwright() as p:
        print("Initializing browser...")
        browser = await p.chromium.launch(
            headless=False,  # Set to True for headless mode
            slow_mo=500      # Reduced delay between actions
        )
        
        page = await browser.new_page()
        
        await page.set_extra_http_headers({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        try:
            url = 'https://www.ycombinator.com/companies?query=saas%20b2b'
            print(f"Navigating to: {url}")
            
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)
            await page.wait_for_timeout(3000)
            
            print("Waiting for companies to load...")
            selectors_to_try = [
                'a[class*="_company_"]',
                '._company_i9oky_355',
                'a[href*="/companies/"]',
                '[class*="_coName_"]'
            ]
            
            page_loaded = False
            for selector in selectors_to_try:
                try:
                    await page.wait_for_selector(selector, timeout=5000)
                    print(f"Found companies using selector: {selector}")
                    page_loaded = True
                    break
                except:
                    continue
            
            if not page_loaded:
                print("Trying to wait for page content...")
                await page.wait_for_timeout(5000)
            
            print("Auto-scrolling to load all companies...")
            await auto_scroll(page)
            
            print("Extracting company information...")
            companies = await page.evaluate("""
                () => {
                    let companyLinks = [];
                    const selectors = [
                        'a[class*="_company_"]',
                        'a[href*="/companies/"]'
                    ];
                    
                    for (const selector of selectors) {
                        companyLinks = document.querySelectorAll(selector);
                        if (companyLinks.length > 0) {
                            break;
                        }
                    }
                    
                    const results = [];

                    companyLinks.forEach((link, index) => {
                        try {
                            let companyName = null;
                            let description = '';
                            let location = '';
                            let profileUrl = '';
                            let tags = [];
                            
                            profileUrl = link.href || link.getAttribute('href');
                            if (profileUrl && !profileUrl.startsWith('http')) {
                                profileUrl = 'https://www.ycombinator.com' + profileUrl;
                            }
                            
                            const nameElement = link.querySelector('[class*="_coName_"]');
                            if (nameElement) {
                                companyName = nameElement.textContent.trim();
                            }
                            
                            const locationElement = link.querySelector('[class*="_coLocation_"]');
                            if (locationElement) {
                                location = locationElement.textContent.trim();
                            }
                            
                            const descElement = link.querySelector('[class*="_coDescription_"]');
                            if (descElement) {
                                description = descElement.textContent.trim();
                            }
                            
                            const pillElements = link.querySelectorAll('.pill, [class*="pill"]');
                            tags = Array.from(pillElements).map(pill => pill.textContent.trim()).filter(text => text.length > 0);
                            
                            if (!companyName && profileUrl) {
                                const match = profileUrl.match(/\\/companies\\/([^\\/\\?]+)/);
                                if (match) {
                                    companyName = match[1].replace(/-/g, ' ');
                                }
                            }

                            if (companyName && companyName.length > 1) {
                                results.push({
                                    name: companyName,
                                    description: description,
                                    location: location,
                                    tags: tags,
                                    profileUrl: profileUrl,
                                    index: index + 1
                                });
                            }
                        } catch (error) {
                            console.log(`Error processing company ${index}:`, error.message);
                        }
                    });

                    return results;
                }
            """)
            
            print(f"Found {len(companies)} companies")
            
        except Exception as e:
            print(f"Error during scraping: {str(e)}")
            raise e
        finally:
            await browser.close()
            print("Browser closed")
    
    return companies

async def auto_scroll(page):
    """
    Auto-scroll the page to load all lazy-loaded content
    """
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

def save_results(companies, filename='yc_saas_b2b_companies.json'):
    """
    Save results to JSON, TXT, and CSV files
    """
    if not companies:
        print("No companies to save")
        return
    
    data = {
        'scrape_date': datetime.now().isoformat(),
        'total_companies': len(companies),
        'search_query': 'saas b2b',
        'companies': companies
    }
    
    try:
        # Save JSON
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Results saved to {filename}")
        
        # Save TXT
        text_filename = filename.replace('.json', '_names_only.txt')
        with open(text_filename, 'w', encoding='utf-8') as f:
            for company in companies:
                f.write(f"{company['name']}\n")
        print(f"Company names saved to {text_filename}")
        
        # Save CSV
        csv_filename = filename.replace('.json', '.csv')
        with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Name', 'Profile URL'])  # Header
            for company in companies:
                writer.writerow([company['name'], company['profileUrl']])
        print(f"CSV file saved to {csv_filename}")
        
    except Exception as e:
        print(f"Error saving results: {str(e)}")

def display_results(companies):
    """
    Display the scraped results in console
    """
    if not companies:
        print("No companies found")
        return
    
    print("\nSCRAPED COMPANIES:")
    print("=" * 50)
    
    for i, company in enumerate(companies, 1):
        print(f"{i}. {company['name']}")
        if company['location']:
            print(f"   Location: {company['location']}")
        if company['description']:
            print(f"   Description: {company['description']}")
        if company['tags']:
            print(f"   Tags: {', '.join(company['tags'])}")
        if company['profileUrl']:
            print(f"   URL: {company['profileUrl']}")
        print()

async def main():
    """
    Main function to run the scraper
    """
    try:
        print("Starting Y Combinator SaaS B2B Company Scraper...")
        companies = await scrape_yc_companies()
        display_results(companies)
        save_results(companies)
        print(f"\nScraping completed! Found {len(companies)} SaaS B2B companies from Y Combinator.")
    except Exception as e:
        print(f"Scraping failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
