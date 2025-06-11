#!/usr/bin/env python3
"""
PDF Chatbot using OpenAI API and Flask
A complete retrieval-based QA system for PDF documents with per-user PDF upload
"""

import os
import json
import numpy as np
import tempfile
from flask import Flask, render_template, request, jsonify, session
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import requests
import re
from typing import List, Dict, Tuple
import logging
from werkzeug.utils import secure_filename
import uuid
import google.generativeai as genai
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

# =========================
# API CONFIGURATION SECTION
# =========================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")  # <-- INSERT YOUR GEMINI API KEY HERE
GEMINI_MODEL = "gemini-2.0-flash"                                 # <-- Gemini model name
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
UPLOAD_FOLDER = tempfile.gettempdir()
SECRET_KEY = os.environ.get("SECRET_KEY")  # Change this for production
# =========================

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini SDK
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# Per-session chatbot storage
user_chatbots = {}

def get_session_id():
    if 'sid' not in session:
        session['sid'] = str(uuid.uuid4())
    return session['sid']

class PDFChatbot:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.embedding_model = SentenceTransformer(EMBEDDING_MODEL)
        self.chunks = []
        self.embeddings = None
        self.load_and_process_pdf()

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        if page_text:
                            text += f"\n--- Page {page_num + 1} ---\n{page_text}"
                    except Exception as e:
                        logger.warning(f"Error extracting text from page {page_num + 1}: {e}")
                        continue
        except Exception as e:
            logger.error(f"Error reading PDF file: {e}")
            raise
        return text

    def clean_text(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'--- Page \d+ ---', '', text)
        return text.strip()

    def chunk_text(self, text: str, chunk_size: int = 800, overlap: int = 100) -> List[str]:
        chunks = []
        text = self.clean_text(text)
        sentences = re.split(r'[.!?]+', text)
        current_chunk = ""
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                words = current_chunk.split()
                if len(words) > 20:
                    current_chunk = " ".join(words[-20:]) + " " + sentence
                else:
                    current_chunk = sentence
            else:
                current_chunk += " " + sentence if current_chunk else sentence
        if current_chunk:
            chunks.append(current_chunk.strip())
        chunks = [chunk for chunk in chunks if len(chunk) > 50]
        logger.info(f"Created {len(chunks)} chunks from PDF")
        return chunks

    def load_and_process_pdf(self):
        logger.info(f"Processing PDF: {self.pdf_path}")
        text = self.extract_text_from_pdf(self.pdf_path)
        if not text.strip():
            raise ValueError("No text extracted from PDF")
        self.chunks = self.chunk_text(text)
        if not self.chunks:
            raise ValueError("No chunks created from PDF")
        logger.info("Creating embeddings...")
        self.embeddings = self.embedding_model.encode(self.chunks)
        logger.info(f"Created embeddings for {len(self.chunks)} chunks")

    def find_relevant_chunks(self, query: str, top_k: int = 3) -> List[Tuple[str, float]]:
        query_embedding = self.embedding_model.encode([query])
        similarities = cosine_similarity(query_embedding, self.embeddings)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        relevant_chunks = []
        for idx in top_indices:
            relevant_chunks.append((self.chunks[idx], similarities[idx]))
        return relevant_chunks

    def answer_question(self, question: str) -> Dict:
        relevant_chunks = self.find_relevant_chunks(question, top_k=3)
        if not relevant_chunks:
            return {
                "answer": "I couldn't find relevant information to answer your question.",
                "sources": [],
                "confidence": 0.0
            }
        context = "\n\n".join([chunk for chunk, _ in relevant_chunks])
        prompt = f"""Based on the following context from a document, please answer the question. If the answer is not in the context, say "I don't have enough information to answer this question."

Context:
{context}

Question: {question}

Answer:"""
        answer = query_llm(prompt)
        avg_confidence = np.mean([score for _, score in relevant_chunks])
        return {
            "answer": answer,
            "sources": [chunk[:200] + "..." if len(chunk) > 200 else chunk for chunk, _ in relevant_chunks],
            "confidence": float(avg_confidence)
        }

def query_llm(prompt: str) -> str:
    """Query Gemini via google-generativeai SDK."""
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error connecting to Gemini SDK: {e}")
        return "Sorry, I couldn't connect to the AI model. Please check your API key and internet connection."

def test_gemini_api():
    print("Testing Gemini API key and model...")
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": "hi"}]
                }
            ]
        }
        response = requests.post(url, headers=headers, json=data, timeout=30)
        if response.status_code == 200:
            candidates = response.json().get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts and "text" in parts[0]:
                    print("Gemini API test response:", parts[0]["text"].strip())
                    return
            print("Gemini API test: No valid response structure.")
        else:
            print(f"Gemini API test failed: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Gemini API test error: {e}")

# Run Gemini API test at startup
test_gemini_api()

# Flask Application
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected"}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    try:
        chatbot = PDFChatbot(file_path)
        session['pdf_path'] = file_path
        sid = get_session_id()
        user_chatbots[sid] = chatbot
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ask', methods=['POST'])
def ask_question():
    sid = get_session_id()
    chatbot = user_chatbots.get(sid)
    if not chatbot:
        return jsonify({"error": "No PDF uploaded for this session."}), 400
    data = request.get_json()
    question = data.get('question', '').strip()
    if not question:
        return jsonify({"error": "No question provided"}), 400
    try:
        result = chatbot.answer_question(question)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error answering question: {e}")
        return jsonify({"error": "Error processing question"}), 500

@app.route('/api/status')
def status():
    sid = get_session_id()
    chatbot = user_chatbots.get(sid)
    return jsonify({
        "status": "ready" if chatbot else "no pdf",
        "chunks": len(chatbot.chunks) if chatbot else 0
    })

def create_html_template():
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 90%;
            max-width: 800px;
            height: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        
        .chat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 15px;
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .user-message {
            text-align: right;
        }
        
        .bot-message {
            text-align: left;
        }
        
        .message-content {
            display: inline-block;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 70%;
            word-wrap: break-word;
        }
        
        .user-message .message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .bot-message .message-content {
            background: white;
            border: 1px solid #e0e0e0;
            color: #333;
        }
        
        .sources {
            margin-top: 10px;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
        }
        
        .input-container {
            padding: 20px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .custom-file-upload {
            display: inline-block;
            padding: 10px 18px;
            cursor: pointer;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 25px;
            font-size: 14px;
            transition: background 0.2s;
            border: none;
            margin-right: 0;
        }
        
        .custom-file-upload:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        
        .upload-btn {
            padding: 10px 18px;
            background: #f0f0f0;
            color: #333;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .upload-btn:hover {
            background: #e0e0e0;
        }
        
        .input-box {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
        }
        
        .input-box:focus {
            border-color: #667eea;
        }
        
        .send-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            cursor: pointer;
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .send-btn:hover {
            transform: scale(1.05);
        }
        
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .loading {
            display: none;
            text-align: center;
            padding: 10px;
            color: #666;
        }
        
        .status {
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
            background: #f8f9fa;
        }
        
        .error {
            color: #dc3545;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PDF Chatbot</h1>
            <p>Ask questions about your document</p>
        </div>
        <div class="chat-container">
            <div class="messages" id="messages">
                <div class="message bot-message">
                    <div class="message-content">
                        Hello! Upload a PDF and ask questions about your document.
                    </div>
                </div>
            </div>
            <div class="loading" id="loading">
                <div>Thinking...</div>
            </div>
            <div class="input-container">
                <form id="uploadForm" enctype="multipart/form-data" style="display: flex; align-items: center; gap: 10px; margin: 0;">
                    <input type="file" id="pdfFile" name="pdf" accept="application/pdf" required style="display: none;">
                    <label for="pdfFile" class="custom-file-upload">Choose PDF</label>
                    <button type="submit" class="upload-btn">Upload</button>
                </form>
                <input type="text" class="input-box" id="questionInput" placeholder="Ask a question about the document..." />
                <button class="send-btn" id="sendBtn">▶</button>
            </div>
        </div>
        <div class="status" id="status">Ready</div>
    </div>
    <script>
        const messagesContainer = document.getElementById('messages');
        const questionInput = document.getElementById('questionInput');
        const sendBtn = document.getElementById('sendBtn');
        const loading = document.getElementById('loading');
        const status = document.getElementById('status');
        const uploadForm = document.getElementById('uploadForm');
        const fileInput = document.getElementById('pdfFile');
        const fileLabel = document.querySelector('.custom-file-upload');
        // Check status on load
        fetch('/api/status')
            .then(response => response.json())
            .then(data => {
                status.textContent = data.status === 'ready'
                    ? `Ready - ${data.chunks} chunks loaded`
                    : 'Please upload a PDF';
                status.className = 'status';
            })
            .catch(error => {
                status.textContent = 'Error connecting to server';
                status.className = 'status error';
            });
        function addMessage(content, isUser = false, sources = null) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            let html = `<div class="message-content">${content}</div>`;
            if (sources && sources.length > 0) {
                html += '<div class="sources"><strong>Sources:</strong><br>';
                sources.forEach((source, index) => {
                    html += `${index + 1}. ${source}<br>`;
                });
                html += '</div>';
            }
            messageDiv.innerHTML = html;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        function askQuestion() {
            const question = questionInput.value.trim();
            if (!question) return;
            addMessage(question, true);
            questionInput.value = '';
            loading.style.display = 'block';
            sendBtn.disabled = true;
            fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: question })
            })
            .then(response => response.json())
            .then(data => {
                loading.style.display = 'none';
                sendBtn.disabled = false;
                if (data.error) {
                    addMessage(`Error: ${data.error}`);
                } else {
                    addMessage(data.answer, false, data.sources);
                }
            })
            .catch(error => {
                loading.style.display = 'none';
                sendBtn.disabled = false;
                addMessage('Sorry, there was an error processing your question.');
            });
        }
        sendBtn.addEventListener('click', askQuestion);
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                askQuestion();
            }
        });
        uploadForm.onsubmit = function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('pdfFile');
            if (!fileInput.files.length) return;
            const formData = new FormData();
            formData.append('pdf', fileInput.files[0]);
            status.textContent = 'Uploading and processing PDF...';
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    status.textContent = 'PDF uploaded and processed!';
                    status.className = 'status';
                } else {
                    status.textContent = 'Upload failed: ' + (data.error || 'Unknown error');
                    status.className = 'status error';
                }
            })
            .catch(() => {
                status.textContent = 'Upload failed';
                status.className = 'status error';
            });
        };
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                fileLabel.textContent = fileInput.files[0].name;
            } else {
                fileLabel.textContent = "Choose PDF";
            }
        });
    </script>
</body>
</html>"""
    os.makedirs('templates', exist_ok=True)
    with open('templates/index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

def main():
    create_html_template()
    app.run(host="0.0.0.0", port=5000, debug=False)

if __name__ == "__main__":
    main()
