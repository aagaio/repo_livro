# app.py - Flask com Blueprints
from flask import Flask
# from routes.v1.api_v1 import api_v1_bp
# from routes.v2.api_v2 import api_v2_bp
# from flasgger import Swagger # Para documentação

app = Flask(__name__)
# swagger = Swagger(app) # Inicializa Swagger

# Simulação de blueprints
# app.register_blueprint(api_v1_bp, url_prefix='/api/v1')
# app.register_blueprint(api_v2_bp, url_prefix='/api/v2')

# TODO: Implementar política de desativação para a v1.
# Monitorar o tráfego da v1 para identificar consumidores ativos antes de desativar.