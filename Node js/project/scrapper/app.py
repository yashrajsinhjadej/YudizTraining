from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
import os
import json
import pandas as pd
import asyncio
import threading
import time
from datetime import datetime
import uuid
import logging
from werkzeug.utils import secure_filename

# Import your existing scraper functions
from merge import main as run_scraper, setup_logging, OUTPUT_DIR

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Global variables to track scraping status
scraping_status = {}
scraping_results = {}

logger = setup_logging()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Read and serve the HTML frontend
@app.route('/')
def index():
    try:
        with open('job_scraper_frontend.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        return html_content
    except FileNotFoundError:
        return "Frontend HTML file not found. Please ensure 'job_scraper_frontend.html' is in the same directory.", 404

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload a CSV file.'}), 400
        
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
        file.save(filepath)
        
        # Validate CSV structure
        try:
            df = pd.read_csv(filepath)
            required_columns = ['Company Name', 'Homepage URL']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                os.remove(filepath)  # Clean up
                return jsonify({
                    'error': f'CSV missing required columns: {", ".join(missing_columns)}. Required: Company Name, Homepage URL'
                }), 400
            
            # Filter valid rows
            valid_rows = df.dropna(subset=['Company Name', 'Homepage URL'])
            company_count = len(valid_rows)
            
            if company_count == 0:
                os.remove(filepath)  # Clean up
                return jsonify({'error': 'No valid companies found in CSV'}), 400
            
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)  # Clean up
            return jsonify({'error': f'Error reading CSV: {str(e)}'}), 400
        
        # Initialize job status
        scraping_status[job_id] = {
            'status': 'uploaded',
            'filename': filename,
            'filepath': filepath,
            'company_count': company_count,
            'processed': 0,
            'successful': 0,
            'jobs_found': 0,
            'companies_with_jobs': 0,
            'current_company': '',
            'progress': 0,
            'start_time': None,
            'logs': []
        }
        
        return jsonify({
            'job_id': job_id,
            'filename': filename,
            'company_count': company_count,
            'message': 'File uploaded successfully'
        })
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/start_scraping', methods=['POST'])
def start_scraping():
    try:
        data = request.get_json()
        job_id = data.get('job_id')
        config = data.get('config', {})
        
        if not job_id or job_id not in scraping_status:
            return jsonify({'error': 'Invalid job ID'}), 400
        
        if scraping_status[job_id]['status'] == 'running':
            return jsonify({'error': 'Scraping already in progress'}), 400
        
        # Update configuration in merge.py if needed
        from merge import CHUNK_SIZE, MAX_RETRIES, MAX_LINKS_TO_VISIT, DELAY_BETWEEN_REQUESTS
        
        # Override global config (you might want to modify merge.py to accept these as parameters)
        chunk_size = config.get('chunkSize', CHUNK_SIZE)
        max_retries = config.get('maxRetries', MAX_RETRIES)
        max_links = config.get('maxLinks', MAX_LINKS_TO_VISIT)
        delay = config.get('delay', DELAY_BETWEEN_REQUESTS)
        
        # Update status
        scraping_status[job_id]['status'] = 'running'
        scraping_status[job_id]['start_time'] = time.time()
        scraping_status[job_id]['config'] = config
        
        # Create a temporary input CSV for the scraper
        temp_csv = f"temp_{job_id}.csv"
        original_csv = scraping_status[job_id]['filepath']
        
        # Copy the uploaded CSV to the expected location
        import shutil
        shutil.copy2(original_csv, temp_csv)
        
        # Start scraping in a separate thread
        def run_scraping_thread():
            try:
                # Modify merge.py to use the temp CSV
                import merge
                original_input_csv = merge.INPUT_CSV
                merge.INPUT_CSV = temp_csv
                
                # Override configuration
                merge.CHUNK_SIZE = chunk_size
                merge.MAX_RETRIES = max_retries
                merge.MAX_LINKS_TO_VISIT = max_links
                merge.DELAY_BETWEEN_REQUESTS = delay
                
                # Run the scraper
                asyncio.run(run_scraper())
                
                # Restore original settings
                merge.INPUT_CSV = original_input_csv
                
                # Load results
                summary_path = os.path.join(OUTPUT_DIR, 'summary.json')
                if os.path.exists(summary_path):
                    with open(summary_path, 'r', encoding='utf-8') as f:
                        summary = json.load(f)
                    
                    scraping_results[job_id] = summary
                    scraping_status[job_id]['status'] = 'completed'
                    scraping_status[job_id]['successful'] = summary.get('successful', 0)
                    scraping_status[job_id]['jobs_found'] = summary.get('total_jobs', 0)
                    scraping_status[job_id]['companies_with_jobs'] = summary.get('companies_with_jobs', 0)
                else:
                    scraping_status[job_id]['status'] = 'error'
                    scraping_status[job_id]['error'] = 'No results found'
                
            except Exception as e:
                logger.error(f"Scraping error for job {job_id}: {e}")
                scraping_status[job_id]['status'] = 'error'
                scraping_status[job_id]['error'] = str(e)
            finally:
                # Clean up temp file
                if os.path.exists(temp_csv):
                    os.remove(temp_csv)
        
        # Start the scraping thread
        thread = threading.Thread(target=run_scraping_thread)
        thread.daemon = True
        thread.start()
        
        return jsonify({'message': 'Scraping started', 'job_id': job_id})
        
    except Exception as e:
        logger.error(f"Start scraping error: {e}")
        return jsonify({'error': f'Failed to start scraping: {str(e)}'}), 500

@app.route('/status/<job_id>')
def get_status(job_id):
    if job_id not in scraping_status:
        return jsonify({'error': 'Job not found'}), 404
    
    status = scraping_status[job_id].copy()
    
    # Add real-time progress if scraping is running
    if status['status'] == 'running':
        # Try to get progress from log files or other indicators
        # For now, we'll simulate progress based on time
        if status['start_time']:
            elapsed = time.time() - status['start_time']
            # Rough estimate: 30 seconds per company on average
            estimated_progress = min((elapsed / 30) / status['company_count'] * 100, 95)
            status['progress'] = estimated_progress
            status['current_company'] = f"Processing companies... ({elapsed:.0f}s elapsed)"
    
    return jsonify(status)

@app.route('/results/<job_id>')
def get_results(job_id):
    if job_id not in scraping_results:
        return jsonify({'error': 'Results not found'}), 404
    
    return jsonify(scraping_results[job_id])

@app.route('/download/<job_id>')
def download_results(job_id):
    if job_id not in scraping_results:
        return jsonify({'error': 'Results not found'}), 404
    
    # Create a zip file with all results
    import zipfile
    import tempfile
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as tmp_file:
        zip_path = tmp_file.name
    
    try:
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            # Add summary
            summary_path = os.path.join(OUTPUT_DIR, 'summary.json')
            if os.path.exists(summary_path):
                zipf.write(summary_path, 'summary.json')
            
            # Add individual company files
            for file in os.listdir(OUTPUT_DIR):
                if file.endswith('.json') and file != 'summary.json':
                    file_path = os.path.join(OUTPUT_DIR, file)
                    zipf.write(file_path, file)
        
        return send_file(zip_path, as_attachment=True, download_name=f'job_scraping_results_{job_id}.zip')
    
    except Exception as e:
        if os.path.exists(zip_path):
            os.remove(zip_path)
        return jsonify({'error': f'Failed to create download: {str(e)}'}), 500

@app.route('/health')
def health_check():
    """Check if Ollama server is running"""
    try:
        import aiohttp
        import asyncio
        
        async def check_ollama():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get("http://localhost:11434", timeout=5) as response:
                        return response.status == 200
            except:
                return False
        
        ollama_status = asyncio.run(check_ollama())
        
        return jsonify({
            'status': 'healthy' if ollama_status else 'unhealthy',
            'ollama_running': ollama_status,
            'message': 'All systems operational' if ollama_status else 'Ollama server not running'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'ollama_running': False,
            'error': str(e)
        })

if __name__ == '__main__':
    print("Starting Job Scraper Server...")
    print("Make sure Ollama is running: ollama run llama3.2:latest")
    print("Server will be available at: http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)