// app.js - Express.js (Vulnerável a falhas criptográficas)
const express = require('express');
const crypto = require('crypto'); // Para o hash MD5 de exemplo
const app = express();
app.use(express.json());

let users = {}; // Simulação de banco de dados de usuários

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password required');
  }
  // ANTIPADRÃO: Armazenar senha em texto plano ou com hash fraco/sem salt
  // users[username] = password; // Pior caso: texto plano
  const md5Hash = crypto.createHash('md5').update(password).digest('hex');
  users[username] = md5Hash; // MD5 é inseguro para senhas
  
  res.status(201).send('User registered');
});

// ANTIPADRÃO: Supõe-se que esta API poderia ser acessada via HTTP,
// expondo senhas em trânsito se o login enviasse a senha.
app.post('/login', (req, res) => {
    // ... lógica de login ...
    // Se a conexão não for HTTPS, credenciais em trânsito estão vulneráveis.
    res.send('Login attempt');
});