# Exemplo Corrigido em Flask
from flask import Flask, request, jsonify
import jwt
import datetime
import os # Para segredos fortes

app = Flask(__name__)
# CORREÇÃO: Usar um segredo forte, idealmente de variáveis de ambiente ou cofre de segredos
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'um-segredo-muito-forte-e-dificil-de-adivinhar')
# CORREÇÃO: Usar algoritmos de assinatura assimétrica se o token for verificado por múltiplos serviços
# ou HS256 com segredo forte se verificado apenas pelo emissor.
ALGORITHM = 'HS256' # ou 'RS256' com chaves pública/privada

# ... (rota de login similar, mas usando o segredo forte e algoritmo seguro) ...

@app.route('/protected', methods=['GET'])
def protected_route_secure():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Token is missing or malformed!'}), 401
    
    token = auth_header.split(" ")[1]

    try:
        # CORREÇÃO: Sempre verificar a assinatura e o algoritmo esperado.
        # A biblioteca PyJWT faz isso por padrão se 'algorithms' for especificado.
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=[ALGORITHM])
        # Adicionar outras validações se necessário (ex: 'issuer', 'audience')
        return jsonify({'message': 'Welcome user!', 'user_id': data['user_id']})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token is invalid!'}), 401