import subprocess
import json
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

COMPANIES_JSON = 'results/companies.json'

@app.route('/api/enrich', methods=['POST'])
def enrich_companies():
    try:
        if not os.path.exists(COMPANIES_JSON):
            return jsonify({'error': f'File not found: {COMPANIES_JSON}'}), 400
        # Run part2.py as a subprocess, always using COMPANIES_JSON
        result = subprocess.run(['python', 'part2.py'], capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 500
        # After enrichment, return the updated JSON
        with open(COMPANIES_JSON, 'r', encoding='utf-8') as f:
            try:
                enriched = json.load(f)
            except Exception as e:
                return jsonify({'error': f'Could not parse enriched JSON: {e}'}), 500
        return jsonify({'message': 'Enrichment complete', 'data': enriched})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
