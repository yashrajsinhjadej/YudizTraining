import asyncio
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from datetime import datetime
import threading
import subprocess

app = Flask(__name__, static_folder='static')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

active_sessions = {}

# Placeholder for MongoDB integration if needed
# from pymongo import MongoClient
# ...

def save_companies(companies):
    os.makedirs('results', exist_ok=True)
    filename = 'results/clutch_companies.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(companies, f, ensure_ascii=False, indent=2)
    print(f"[DEBUG] Saved {len(companies)} companies to {filename}")
    return filename

@app.route('/api/clutch/scrape', methods=['POST'])
def start_clutch_scraping():
    def run_scraping():
        print("[DEBUG] Starting Clutch scraping thread...")
        try:
            # Import here to avoid circular import
            from clutch.part1 import scrape_clutch_companies
            companies = asyncio.run(scrape_clutch_companies())
            save_companies(companies)
            active_sessions['clutch'] = {
                'status': 'completed',
                'data': companies
            }
            print("[DEBUG] Clutch scraping complete.")
        except Exception as e:
            print(f"[ERROR] Clutch scraping failed: {e}")
            active_sessions['clutch'] = {
                'status': 'failed',
                'error': str(e)
            }
    threading.Thread(target=run_scraping).start()
    return jsonify({'status': 'started'})

@app.route('/api/clutch/status')
def get_clutch_status():
    return jsonify(active_sessions.get('clutch', {'status': 'not started'}))

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5050)





