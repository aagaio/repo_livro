# app.py - Flask (Corrigido)
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

app = Flask(__name__)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

inventory = {
    'produto_promocional_xyz': {'name': 'Produto XYZ em Promoção', 'price': 10.00, 'stock': 5}
}
# Simulação de histórico de compras
purchase_history = {} 

@app.route('/api/purchase/promo_xyz', methods=['POST'])
# @isAuthenticated 
@limiter.limit("3 per minute") # CORREÇÃO: Rate limiting mais estrito para este fluxo
def purchase_promo_item_secure():
    user_id = "simulated_user_id" # request.user.id 
    
    # CORREÇÃO: Limitar a quantidade por usuário
    if user_id not in purchase_history:
        purchase_history[user_id] = 0
    
    if purchase_history[user_id] >= 1: # Limite de 1 item promocional por usuário
        return jsonify({'message': 'Você já atingiu o limite de compra para este item promocional.'}), 403

    if inventory['produto_promocional_xyz']['stock'] > 0:
        inventory['produto_promocional_xyz']['stock'] -= 1
        purchase_history[user_id] += 1
        # Lógica de processamento de pagamento...
        return jsonify({'message': f"Compra do {inventory['produto_promocional_xyz']['name']} realizada! Estoque: {inventory['produto_promocional_xyz']['stock']}"}), 200
    else:
        return jsonify({'message': 'Produto promocional esgotado!'}), 400