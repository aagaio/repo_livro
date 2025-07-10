# app.py - Flask (Vulnerável a Quebra de Controle de Acesso)
from flask import Flask, request, jsonify, abort
# from flask_login import LoginManager, login_required, current_user (simulando autenticação)

app = Flask(__name__)
# app.secret_key = 'supersecretkey'
# login_manager = LoginManager()
# login_manager.init_app(app)

# Simulação de banco de dados e usuários
documents_db = {
    'doc123': {'owner_id': 'user_A', 'content': 'Conteúdo secreto do User A'},
    'doc456': {'owner_id': 'user_B', 'content': 'Conteúdo confidencial do User B'}
}
# Simulando um usuário autenticado (em um app real, viria do flask_login, JWT, etc.)
# current_user = {'id': 'user_A', 'role': 'user'} 

@app.route('/documents/<document_id>')
# @login_required # Supõe que o usuário está autenticado
def get_document(document_id):
    simulated_current_user_id = 'user_A' # Para fins de exemplo
    simulated_current_user_role = 'user'

    document = documents_db.get(document_id)
    if not document:
        abort(404, description="Document not found")

    # ANTIPADRÃO: Nenhuma verificação se o current_user.id é o document['owner_id']
    # ou se current_user.role é 'admin'. Qualquer usuário autenticado que adivinhe
    # o document_id pode acessar o documento.
    return jsonify(document)