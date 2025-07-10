# app.py - Flask (Corrigido - Usando JSON para dados de cookie)
from flask import Flask, request, make_response, jsonify
import json # CORREÇÃO: Usar JSON
import base64

app = Flask(__name__)
app.secret_key = 'outra_chave_secreta_forte'

@app.route('/set-preferences-secure', methods=['POST'])
def set_preferences_secure():
    theme = request.json.get('theme', 'light')
    show_notifications = request.json.get('notifications', True)

    # CORREÇÃO: Validar os dados de entrada
    if theme not in ['light', 'dark', 'blue']: # Exemplo de validação
         return jsonify({"error": "Tema inválido"}), 400
    if not isinstance(show_notifications, bool):
         return jsonify({"error": "Configuração de notificação inválida"}), 400

    prefs_dict = {"theme": theme, "notifications": show_notifications}
    json_prefs = json.dumps(prefs_dict) # Serializar para JSON
    encoded_prefs = base64.b64encode(json_prefs.encode('utf-8')).decode('utf-8')
    
    resp = make_response(jsonify({"message": "Preferências salvas de forma segura."}))
    # CORREÇÃO: Considerar HttpOnly e Secure (para HTTPS) nos cookies
    resp.set_cookie('user_prefs_secure', encoded_prefs, httponly=True, samesite='Lax') 
    return resp

@app.route('/get-preferences-secure')
def get_preferences_secure():
    encoded_prefs_cookie = request.cookies.get('user_prefs_secure')
    if not encoded_prefs_cookie:
        return jsonify({"message": "Nenhuma preferência encontrada."}), 404
    
    try:
        json_prefs_bytes = base64.b64decode(encoded_prefs_cookie.encode('utf-8'))
        # CORREÇÃO: Parsear JSON
        user_prefs_data = json.loads(json_prefs_bytes.decode('utf-8'))

        # CORREÇÃO: Validar estrutura e tipos dos dados após o parse
        theme = user_prefs_data.get('theme')
        notifications = user_prefs_data.get('notifications')

        if theme not in ['light', 'dark', 'blue'] or not isinstance(notifications, bool):
             raise ValueError("Dados de preferência inválidos no cookie")
        
        return jsonify({"theme": theme, "notifications": notifications})
    except (json.JSONDecodeError, ValueError) as e:
        app.logger.error(f"Erro ao carregar preferências seguras: {e}")
        return jsonify({"error": "Erro ao carregar preferências ou dados inválidos."}), 400
    except Exception as e:
        app.logger.error(f"Erro inesperado ao carregar preferências seguras: {e}")
        return jsonify({"error": "Erro interno ao carregar preferências."}), 500