// app.js - Express.js (Corrigido)
const express = require('express');
const session = require('express-session');
const crypto = require('crypto'); // Para gerar segredos fortes
const rateLimit = require('express-rate-limit'); // Para rate limiting
const bcrypt = require('bcrypt'); // Para hash de senhas
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORREÇÃO: Segredo de sessão forte, de variável de ambiente ou gerado aleatoriamente
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // CORREÇÃO: Apenas salvar sessão quando modificada
  cookie: {
    secure: process.env.NODE_ENV === 'production', // CORREÇÃO: True em produção (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // Ex: 1 hora de validade para o cookie
    sameSite: 'lax' // Ajuda a proteger contra CSRF
  }
}));

// CORREÇÃO: Rate limiting para o endpoint de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita cada IP a 5 requisições de login por janela de 15 minutos
  message: 'Muitas tentativas de login deste IP, tente novamente após 15 minutos',
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Simulação de banco de dados (senhas devem estar hasheadas com bcrypt)
const users_db_secure = {}; 
async function registerUser(username, password) {
    const saltRounds = 10;
    users_db_secure[username] = { passwordHash: await bcrypt.hash(password, saltRounds) };
}
// registerUser('testuser', 'Password!123'); // Exemplo de registro

app.post('/login-secure', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!users_db_secure[username]) {
    return res.status(401).send('Credenciais inválidas.');
  }
  const match = await bcrypt.compare(password, users_db_secure[username].passwordHash);

  if (match) {
    // CORREÇÃO: Regenerar ID de sessão para prevenir fixação de sessão
    req.session.regenerate((err) => {
      if (err) {
        console.error("Erro ao regenerar sessão:", err);
        return res.status(500).send("Erro interno no login.");
      }
      req.session.user = { username: username, loggedIn: true, id: "someUserId" }; // Adicionar ID do usuário
      res.send(`Login seguro! Bem-vindo ${username}.`);
    });
  } else {
    res.status(401).send('Credenciais inválidas.');
  }
});

app.get('/logout-secure', (req, res) => {
  // CORREÇÃO: Destruir a sessão no servidor e limpar o cookie
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Não foi possível fazer logout.');
    }
    res.clearCookie('connect.sid'); // 'connect.sid' é o nome padrão do cookie de express-session
    res.send('Logout seguro realizado com sucesso.');
  });
});
