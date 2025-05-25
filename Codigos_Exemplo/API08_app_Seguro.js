// app.js - Express.js (Corrigido)
const express = require('express');
const helmet = require('helmet'); // CORREÇÃO: Middleware para cabeçalhos de segurança
const app = express();
const path = require('path');

// CORREÇÃO: Aplicar helmet para configurar cabeçalhos de segurança importantes
app.use(helmet()); 
// Pode-se configurar o helmet mais granularmente:
// app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }));
// app.use(helmet.hsts({ maxAge: 60 * 60 * 24 * 365, includeSubDomains: true, preload: true })); 
// etc.

// Para servir arquivos estáticos, o Express não permite listagem por padrão.
// A configuração do servidor web (Nginx/Apache) à frente do Node.js
// deve ser verificada para desabilitar a listagem de diretórios (ex: `Options -Indexes` no Apache).
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Bem-vindo!');
});

// CORREÇÃO: Tratamento de erro genérico em produção
app.use((err, req, res, next) => {
  console.error(err.stack); // Logar o erro detalhado no servidor
  // Em produção, enviar uma mensagem genérica
  if (process.env.NODE_ENV === 'production') {
    res.status(500).send('Ocorreu um erro interno no servidor.');
  } else {
    // Em desenvolvimento, pode enviar mais detalhes
    res.status(500).send(`Erro: ${err.message}`);
  }
});