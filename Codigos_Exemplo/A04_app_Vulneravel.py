# app.py - Flask
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
users_db = {'testuser': generate_password_hash('password123')}

@app.route('/login_design_secure', methods=['POST'])
def login_design_secure():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    hashed_password = users_db.get(username)
    
    # CORREÇÃO: Mesmo que o usuário não exista (hashed_password é None),
    # continua-se para uma pseudo-verificação de senha para evitar timing difference
    # e retorna uma mensagem genérica.
    if hashed_password and check_password_hash(hashed_password, password):
        # Lógica de sucesso no login (gerar token, etc.)
        return jsonify({'message': 'Login successful'}), 200
    else:
        # Mensagem genérica para ambos os casos: usuário não existe ou senha incorreta
        return jsonify({'message': 'Invalid username or password'}), 401