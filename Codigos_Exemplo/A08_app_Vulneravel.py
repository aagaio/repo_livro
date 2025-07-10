# app.py - Flask (Vulnerável a Desserialização Insegura com pickle em cookie)
from flask import Flask, request, make_response, jsonify
import pickle
import base64

app = Flask(__name__)
app.secret_key = 'chave_secreta_para_cookies_de_sessao' # Necessário para cookies assinados do Flask

class UserPrefs:
    def __init__(self, theme='light', notifications=True):
        self.theme = theme
        self.notifications = notifications
    def __repr__(self): # Para facilitar a visualização
        return f"UserPrefs(theme='{self.theme}', notifications={self.notifications})"

@app.route('/set-preferences', methods=['POST'])
def set_preferences():
    theme = request.json.get('theme', 'light')
    show_notifications = request.json.get('notifications', True)
    prefs = UserPrefs(theme, show_notifications)
    
    # ANTIPADRÃO: Serializar um objeto Python com pickle e colocar em um cookie
    pickled_prefs = pickle.dumps(prefs)
    encoded_prefs = base64.b64encode(pickled_prefs).decode('utf-8')
    
    resp = make_response(jsonify({"message": "Preferências salvas no cookie."}))
    resp.set_cookie('user_prefs', encoded_prefs)
    return resp

@app.route('/get-preferences')
def get_preferences():
    encoded_prefs_cookie = request.cookies.get('user_prefs')
    if not encoded_prefs_cookie:
        return jsonify({"message": "Nenhuma preferência encontrada."}), 404
    
    try:
        pickled_prefs_bytes = base64.b64decode(encoded_prefs_cookie.encode('utf-8'))
        # ANTIPADRÃO: Desserializar dados de uma fonte não confiável (cookie) usando pickle.
        # Pickle pode executar código arbitrário se o payload for malicioso.
        user_prefs_object = pickle.loads(pickled_prefs_bytes)
        return jsonify({"theme": user_prefs_object.theme, "notifications": user_prefs_object.notifications})
    except Exception as e:
        app.logger.error(f"Erro ao carregar preferências: {e}")
        return jsonify({"error": "Erro ao carregar preferências do cookie."}), 500