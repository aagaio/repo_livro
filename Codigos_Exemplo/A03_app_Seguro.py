# app.py - Flask (Corrigido)
# ... (mesmo init_db) ...

@app.route('/products_secure')
def search_products_secure():
    product_name_param = request.args.get('name', '')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # CORREÇÃO: Usar consultas parametrizadas
    query = "SELECT * FROM products WHERE name LIKE ?"
    # O '?' é um placeholder. O valor é passado de forma segura no segundo argumento do execute.
    # Adiciona '%' para a busca LIKE de forma segura
    safe_search_term = f"%{product_name_param}%" 
    
    try:
        cursor.execute(query, (safe_search_term,))
        products = cursor.fetchall()
    except Exception as e:
        app.logger.error(f"SQL Error: {e}")
        return jsonify({"error": "Database query error"}), 500
    finally:
        conn.close()
        
    return jsonify(products)