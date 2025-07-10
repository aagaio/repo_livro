// app.js - Express.js (Corrigido)
const express = require('express');
const bcrypt = require('bcrypt'); // CORREÇÃO: Usar bcrypt para senhas
const https = require('https'); // CORREÇÃO: Para forçar HTTPS (em um cenário real, configuraria o servidor)
const fs = require('fs'); // Para carregar certificados SSL (exemplo)
const app = express();
app.use(express.json());

let users_secure = {};
const saltRounds = 10;

app.post('/register_secure', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password required');
  }
  // CORREÇÃO: Usar hash forte com salt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  users_secure[username] = hashedPassword;
  res.status(201).send('User registered securely');
});

app.post('/login_secure', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = users_secure[username];
    if (hashedPassword && await bcrypt.compare(password, hashedPassword)) {
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// CORREÇÃO: Em produção, configurar o servidor (Nginx, Apache, etc.) para forçar HTTPS
// ou usar um provedor de PaaS que faça isso. Exemplo conceitual para Node.js:
/*
const options = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt')
};
https.createServer(options, app).listen(443, () => {
  console.log('App listening on port 443 (HTTPS)');
});
*/