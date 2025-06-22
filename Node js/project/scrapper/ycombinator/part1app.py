# app.py - Flask Backend Server
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import asyncio
import json
from datetime import datetime
from playwright.async_api import async_playwright
import time
import threading
import os
import part1  # Make sure part1.py is in the same directory or in PYTHONPATH
import subprocess
from pymongo import MongoClient

app = Flask(__name__, static_folder='static')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

print("[DEBUG] Flask app initialized.")

# MongoDB configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "ycombinator"
COLLECTION_NAME = "companies"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Store active scraping sessions
active_sessions = {}

def save_companies(companies, use_timestamp=False):
    """
    Save companies to results/companies.json or results/yc_companies_YYYYMMDD_HHMMSS.json
    Always saves only the list of companies, not metadata.
    """
    os.makedirs('results', exist_ok=True)
    if use_timestamp:
        filename = f"results/yc_companies_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    else:
        filename = "results/companies.json"
    print(f"[DEBUG] Saving {len(companies)} companies to {filename}")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(companies, f, ensure_ascii=False, indent=2)
    print(f"[DEBUG] Saved to {filename}")
    return filename


def upsert_companies_to_db(companies):
    """Insert new companies or update existing ones in MongoDB by name."""
    for company in companies:
        collection.update_one(
            {"name": company["name"]},
            {"$set": company},
            upsert=True
        )
    print(f"[DB] Upserted {len(companies)} companies into MongoDB.")


class ScrapingProgress:
    def __init__(self, session_id):
        print(f"[DEBUG] ScrapingProgress created for session: {session_id}")
        self.session_id = session_id
        self.status = "initializing"
        self.message = ""
        self.progress = 0
        self.companies = []
        self.total_companies = 0
        
    def update_status(self, status, message, progress=None):
        print(f"[DEBUG] Status update for {self.session_id}: {status} - {message} ({progress})")
        self.status = status
        self.message = message
        if progress is not None:
            self.progress = progress
        
        # Emit to frontend via WebSocket
        socketio.emit('scraping_update', {
            'session_id': self.session_id,
            'status': self.status,
            'message': self.message,
            'progress': self.progress,
            'total_companies': self.total_companies
        })

async def scrape_yc_companies_with_progress(url, session_id):
    print(f"[DEBUG] scrape_yc_companies_with_progress called with url={url}, session_id={session_id}")
    progress = ScrapingProgress(session_id)
    companies = []
    
    try:
        async with async_playwright() as p:
            progress.update_status("loading", "Initializing browser...", 10)
            print("[DEBUG] Launching browser...")
            browser = await p.chromium.launch(
                headless=True,  # Set to True for production
                slow_mo=100
            )
            page = await browser.new_page()
            print("[DEBUG] New page created.")
            await page.set_extra_http_headers({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            progress.update_status("loading", f"Navigating to: {url}", 20)
            print(f"[DEBUG] Navigating to {url}")
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)
            await page.wait_for_timeout(3000)
            progress.update_status("loading", "Waiting for companies to load...", 30)
            print("[DEBUG] Waiting for selectors...")
            selectors_to_try = [
                'a[class*="_company_"]',
                '._company_i9oky_355',
                'a[href*="/companies/"]',
                '[class*="_coName_"]'
            ]
            page_loaded = False
            for selector in selectors_to_try:
                try:
                    print(f"[DEBUG] Trying selector: {selector}")
                    await page.wait_for_selector(selector, timeout=5000)
                    page_loaded = True
                    print(f"[DEBUG] Selector found: {selector}")
                    break
                except Exception as e:
                    print(f"[DEBUG] Selector not found: {selector} ({e})")
                    continue
            if not page_loaded:
                print("[DEBUG] No selector found, waiting extra 5s.")
                await page.wait_for_timeout(5000)
            progress.update_status("loading", "Auto-scrolling to load all companies...", 50)
            print("[DEBUG] Auto-scrolling...")
            await auto_scroll_with_progress(page, progress)
            progress.update_status("loading", "Extracting company information...", 80)
            print("[DEBUG] Extracting company info from page...")
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
            print(f"[DEBUG] Extracted {len(companies)} companies.")
            progress.total_companies = len(companies)
            progress.update_status("success", f"Successfully scraped {len(companies)} companies!", 100)
            print("[DEBUG] Closing browser...")
            await browser.close()
    except Exception as e:
        print(f"[ERROR] Exception in scrape_yc_companies_with_progress: {e}")
        progress.update_status("error", f"Error during scraping: {str(e)}", 0)
        raise e
    print(f"[DEBUG] scrape_yc_companies_with_progress returning {len(companies)} companies.")
    return companies

async def auto_scroll_with_progress(page, progress):
    print("[DEBUG] Entered auto_scroll_with_progress()")
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
    progress.update_status("loading", "Finished loading all companies...", 70)
    print("[DEBUG] Exiting auto_scroll_with_progress()")

@app.route('/')
def serve_frontend():
    print("[DEBUG] Serving frontend HTML.")
    return send_from_directory('.', 'part1.html')

@app.route('/api/scrape', methods=['POST'])
def start_scraping():
    print("[DEBUG] /api/scrape called.")
    try:
        data = request.json
        url = data.get('url')
        session_id = data.get('session_id', f"session_{int(time.time())}")
        print(f"[DEBUG] Scrape request: url={url}, session_id={session_id}")
        if not url:
            print("[DEBUG] No URL provided.")
            return jsonify({'error': 'URL is required'}), 400
        def run_scraping():
            print(f"[DEBUG] Background scraping thread started for session {session_id}")
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                companies_list = loop.run_until_complete(
                    scrape_yc_companies_with_progress(url, session_id)
                )
                save_companies(companies_list, use_timestamp=False)
                upsert_companies_to_db(companies_list)
                result_data = {
                    'filename': filename,
                    'total_companies': len(companies_list),
                    'companies': companies_list
                }
                active_sessions[session_id] = {
                    'status': 'completed',
                    'data': result_data,
                }
                print(f"[DEBUG] Scraping completed for session {session_id}")
            except Exception as e:
                print(f"[ERROR] Exception in scrape_yc_companies_with_progress: {e}")
                active_sessions[session_id] = {
                    'status': 'failed',
                    'error': str(e),
                }
        threading.Thread(target=run_scraping).start()
        return jsonify({'status': 'started', 'session_id': session_id})
    except Exception as e:
        print(f"[ERROR] /api/scrape failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/status/<session_id>')
def get_scraping_status(session_id):
    print(f"[DEBUG] /api/status/{session_id} called.")
    session_data = active_sessions.get(session_id)
    if not session_data:
        print(f"[DEBUG] Session {session_id} not found.")
        return jsonify({'error': 'Session not found'}), 404
    print(f"[DEBUG] Returning status for session {session_id}.")
    return jsonify(session_data)

@app.route('/api/download/<session_id>/<format>')
def download_results(session_id, format):
    print(f"[DEBUG] /api/download/{session_id}/{format} called.")
    session_data = active_sessions.get(session_id)
    if not session_data or session_data['status'] != 'completed':
        print(f"[DEBUG] Results not available for session {session_id}.")
        return jsonify({'error': 'Results not available'}), 404
    filename = session_data.get('filename')
    if not filename:
        print(f"[DEBUG] File not found for session {session_id}.")
        return jsonify({'error': 'File not found'}), 404
    if format == 'json':
        print(f"[DEBUG] Sending JSON file for session {session_id}.")
        return send_from_directory('results', filename, as_attachment=True)
    elif format == 'csv':
        csv_filename = filename.replace('.json', '.csv')
        print(f"[DEBUG] Sending CSV file for session {session_id}.")
        return send_from_directory('results', csv_filename, as_attachment=True)
    else:
        print(f"[DEBUG] Invalid format requested: {format}")
        return jsonify({'error': 'Invalid format'}), 400

@app.route('/api/enrich', methods=['POST'])
def enrich_companies():
    COMPANIES_JSON = 'results/companies.json'
    try:
        if not os.path.exists(COMPANIES_JSON):
            return jsonify({'error': f'File not found: {COMPANIES_JSON}'}), 400
        # Run part2.py as a subprocess, always using COMPANIES_JSON
        result = subprocess.run(['python', 'part2.py'], capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 500
        # After enrichment, update DB with enriched companies
        with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
            try:
                enriched = json.load(f)
                upsert_companies_to_db(enriched)
            except Exception as e:
                return jsonify({'error': f'Could not parse enriched JSON: {e}'}), 500
        return jsonify({'message': 'Enrichment complete', 'data': enriched})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print('[DEBUG] Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('[DEBUG] Client disconnected')

@socketio.on('start_scraping')
def handle_start_scraping(data):
    print(f"[DEBUG] WebSocket start_scraping called: {data}")
    try:
        url = data.get('url')
        session_id = data.get('session_id')
        if not url:
            print("[DEBUG] No URL provided in WebSocket event.")
            emit('scraping_error', {'session_id': session_id, 'error': 'URL is required'})
            return
        print(f"[DEBUG] Starting scraping for session {session_id} with URL: {url}")
        emit('scraping_update', {
            'message': 'Scraping started...',
            'status': 'loading',
            'progress': 10,
            'session_id': session_id
        })
        def run_scraping():
            print(f"[DEBUG] WebSocket background scraping thread started for session {session_id}")
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                companies = loop.run_until_complete(
                    scrape_yc_companies_with_progress(url, session_id)
                )
                filename = save_companies(companies, use_timestamp=False)
                result_data = {
                    'filename': filename,
                    'total_companies': len(companies),
                    'companies': companies
                }
                active_sessions[session_id] = {
                    'status': 'completed',
                    'data': result_data,
                    'filename': filename
                }
                print(f"[DEBUG] WebSocket scraping complete for session {session_id}")
                socketio.emit('scraping_complete', {
                    'session_id': session_id,
                    'data': result_data
                })
            except Exception as e:
                print(f"[ERROR] WebSocket scraping error in thread: {str(e)}")
                active_sessions[session_id] = {
                    'status': 'error',
                    'error': str(e)
                }
                socketio.emit('scraping_error', {
                    'session_id': session_id,
                    'error': str(e)
                })
            finally:
                print(f"[DEBUG] WebSocket closing event loop for session {session_id}")
                loop.close()
        thread = threading.Thread(target=run_scraping)
        thread.daemon = True
        thread.start()
        print(f"[DEBUG] WebSocket scraping thread started for session {session_id}")
        emit('scraping_started', {'session_id': session_id, 'message': 'Scraping started successfully'})
    except Exception as e:
        print(f"[ERROR] Handler error in WebSocket: {str(e)}")
        emit('scraping_error', {'session_id': data.get('session_id'), 'error': str(e)})

if __name__ == '__main__':
    os.makedirs('static', exist_ok=True)
    print("[DEBUG] Starting Flask server on http://localhost:5000")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)