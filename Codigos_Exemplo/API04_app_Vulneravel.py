# app.py - Flask (Vulnerável a consumo irrestrito)
from flask import Flask, request, jsonify
import os
# import time # Para simular processamento pesado

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    # ANTIPADRÃO: Nenhum limite no tamanho do arquivo.
    # Um atacante pode enviar arquivos enormes, consumindo disco e processamento.
    filename = file.filename 
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # ANTIPADRÃO: Nenhum limite no número de uploads por usuário/IP.
    return jsonify({'message': f'File {filename} uploaded successfully'}), 201

@app.route('/api/reports/all', methods=['GET'])
def get_all_reports():
    # ANTIPADRÃO: Consulta que pode retornar um volume massivo de dados
    # sem paginação ou limites, consumindo memória e CPU do servidor e do cliente.
    # all_data = db.query_all_reports() # Simulação de consulta pesada
    # time.sleep(10) # Simula processamento pesado para cada requisição
    return jsonify({"message": "Simulating fetching all reports, could be very large"}), 200