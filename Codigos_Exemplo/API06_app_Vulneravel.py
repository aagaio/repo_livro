# app.py - Flask (Vulnerável a abuso de fluxo de negócio)
from flask import Flask, request, jsonify
# import time # Para simular

app = Flask(__name__)

# Simulação de banco de dados de estoque
inventory = {
    'produto_promocional_xyz': {'name': 'Produto XYZ em Promoção', 'price': 10.00, 'stock': 5}
}

# Supõe-se que o usuário está autenticado (req.user.id)

@app.route('/api/purchase/promo_xyz', methods=['POST'])
# @isAuthenticated # (Middleware de autenticação omitido para brevidade, mas seria necessário)
def purchase_promo_item():
    # user_id = request.user.id # Supõe que temos o ID do usuário
    
    # ANTIPADRÃO: Nenhuma verificação de quantas vezes este usuário já comprou
    # ou quão rápido as requisições estão chegando (ausência de rate limiting específico para o fluxo).
    
    if inventory['produto_promocional_xyz']['stock'] > 0:
        inventory['produto_promocional_xyz']['stock'] -= 1
        # Lógica de processamento de pagamento...
        return jsonify({'message': f"Compra do {inventory['produto_promocional_xyz']['name']} realizada com sucesso! Estoque restante: {inventory['produto_promocional_xyz']['stock']}"}), 200
    else:
        return jsonify({'message': 'Produto promocional esgotado!'}), 400