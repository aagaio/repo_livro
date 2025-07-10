// app.js - Express.js (Vulnerável a Falhas de Identificação e Autenticação)
const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'meu_segredo_super_secreto_123', // ANTIPADRÃO: Segredo de sessão fraco e previsível
  resave: false, // Boa prática
  saveUninitialized: true, // Pode criar sessões desnecessárias antes do login
  cookie: {
    secure: false, // ANTIPADRÃO: Em produção, deve ser true (requer HTTPS)
    httpOnly: true, // Bom - previne acesso XSS ao cookie
    // maxAge não definido explicitamente, pode usar o padrão do navegador ou da lib.
  }
}));

// Simulação de banco de dados de usuários (senhas deveriam estar hasheadas!)
const users_db = { 'testuser': { password: 'password123' } };

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // ANTIPADRÃO: Nenhuma proteção contra força bruta (rate limiting ou bloqueio de conta)
  if (users_db[username] && users_db[username].password === password) {
    req.session.user = { username: username, loggedIn: true };
    // ANTIPADRÃO: ID de sessão pode ser previsível ou não suficientemente aleatório se a lib não for robusta
    return res.send(`Login bem-sucedido! Bem-vindo ${username}.`);
  }
  res.status(401).send('Credenciais inválidas.');
});

app.get('/dashboard', (req, res) => {
  if (req.session.user && req.session.user.loggedIn) {
    return res.send(`Painel do usuário: ${req.session.user.username}. ID da Sessão: ${req.sessionID}`);
  }
  res.status(401).send('Não autenticado. Faça o login.');
});

app.get('/logout', (req, res) => {
  // ANTIPADRÃO: Apenas limpar a propriedade da sessão não destrói a sessão no servidor
  // nem invalida o cookie de forma robusta em todos os cenários.
  if (req.session.user) {
    req.session.user = null; 
  }
  res.send('Logout realizado (mas a sessão no servidor pode ainda existir).');
});