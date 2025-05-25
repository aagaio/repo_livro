# app.py - Flask (Corrigido)
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
# CORREÇÃO: Definir um tamanho máximo para o arquivo de upload (ex: 5MB)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/upload', methods=['POST'])
@limiter.limit("10 per minute") # CORREÇÃO: Limita o número de uploads
def upload_file_secure():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    # A verificação de MAX_CONTENT_LENGTH é feita automaticamente pelo Flask se configurada.
    # Se o arquivo for maior, o Flask retornará um erro 413 (Request Entity Too Large).
    
    filename = file.filename # Idealmente, use um nome de arquivo seguro/gerado
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'message': f'File {filename} uploaded successfully'}), 201

@app.route('/api/reports', methods=['GET']) # Endpoint alterado para permitir paginação
def get_reports_paginated():
    # CORREÇÃO: Implementar paginação e limites
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    if per_page > 100: # Limite máximo por página
        per_page = 100
        
    # paginated_data = db.query_reports_paginated(page, per_page) # Simulação
    return jsonify({
        "message": f"Fetching reports page {page}, {per_page} items per page",
        # "data": paginated_data,
        # "total_pages": ...
    }), 200