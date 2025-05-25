# Exemplo Vulnerável em Flask (JWT fraco ou sem validação)
from flask import Flask, request, jsonify
import jwt # PyJWT
import datetime

app = Flask(__name__)
# ERRO: Segredo fraco ou previsível! Em produção, use um segredo forte e aleatório.
app.config['SECRET_KEY'] = 'mysecretkey'
# ERRO: Permitir algoritmo 'none' é perigoso!
# ALGORITHM = 'none' (Pior caso, permite tokens sem assinatura)
ALGORITHM = 'HS256' # Mesmo com HS256, o segredo fraco é um problema

@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization
    if auth and auth.username == 'testuser' and auth.password == 'testpass':
        token = jwt.encode({
            'user_id': 123,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm=ALGORITHM)
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/protected', methods=['GET'])
def protected_route():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    
    token = token.split(" ")[1] # Assume formato "Bearer <token>"

    try:
        # ERRO: Se o algoritmo 'none' fosse permitido na codificação,
        # um atacante poderia forjar um token com 'alg': 'none' e pular a verificação do segredo.
        # Ou, se a validação da assinatura for omitida (ex: verify=False).
        # jwt.decode(token, app.config['SECRET_KEY'], algorithms=[ALGORITHM], options={"verify_signature": False}) # Exemplo de não validação
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=[ALGORITHM])
        return jsonify({'message': 'Welcome user!', 'user_id': data['user_id']})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token is invalid!'}), 401