# app.py - Flask (Vulnerável a SQL Injection)
import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
    ''')
    cursor.execute("INSERT OR IGNORE INTO products (name, description) VALUES (?, ?)", ('Laptop Gamer', 'Ótimo para jogos'))
    cursor.execute("INSERT OR IGNORE INTO products (name, description) VALUES (?, ?)", ('Mouse Óptico', 'Confortável e preciso'))
    conn.commit()
    conn.close()

init_db()

@app.route('/products')
def search_products():
    product_name = request.args.get('name', '')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # ANTIPADRÃO: Concatenação direta do input do usuário na query SQL
    query = f"SELECT * FROM products WHERE name LIKE '%{product_name}%'"
    app.logger.info(f"Executing query: {query}") # Apenas para depuração
    
    try:
        cursor.execute(query) # Se product_name for algo como "X'; DROP TABLE users; --"
        products = cursor.fetchall()
    except Exception as e:
        app.logger.error(f"SQL Error: {e}")
        return jsonify({"error": "Database query error"}), 500
    finally:
        conn.close()
        
    return jsonify(products)