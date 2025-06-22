import sys
import asyncio
from playwright.async_api import async_playwright

async def is_scrapable(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            response = await page.goto(url, wait_until='domcontentloaded', timeout=15000)
            await page.wait_for_timeout(2000)
            await browser.close()
            if response and response.status == 200:
                print(f"[OK] {url} is scrapable (HTTP 200)")
                return True
            else:
                print(f"[FAIL] {url} is not scrapable (HTTP {response.status if response else 'No Response'})")
                return False
    except Exception as e:
        print(f"[ERROR] {url} is not scrapable: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python check_scrapable.py <url>")
        sys.exit(1)
    url = sys.argv[1]
    asyncio.run(is_scrapable(url))
