# app.py - Flask (Corrigido)
# ... (mesmo setup de app, documents_db, e simulação de current_user) ...

@app.route('/documents_secure/<document_id>')
# @login_required
def get_document_secure(document_id):
    simulated_current_user_id = 'user_A' 
    simulated_current_user_role = 'user'
    
    document = documents_db.get(document_id)
    if not document:
        abort(404, description="Document not found")

    # CORREÇÃO: Verificação explícita de controle de acesso
    if document['owner_id'] != simulated_current_user_id and simulated_current_user_role != 'admin':
        abort(403, description="You are not authorized to access this document.")
        
    return jsonify(document)