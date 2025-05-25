// app.js - Express.js (Vulnerável a misconfiguration)
const express = require('express');
const app = express();
const path = require('path');

// ANTIPADRÃO: Nenhum cabeçalho de segurança HTTP configurado (X-Content-Type-Options, X-Frame-Options, CSP, HSTS etc.)
// Isso pode ser feito com middlewares como 'helmet'

// ANTIPADRÃO (Exemplo de configuração de servidor web, não diretamente no Express):
// Se o servidor web (Nginx, Apache) que serve os arquivos estáticos estiver mal configurado
// para permitir listagem de diretórios.
// O Express por si só não faz listagem de diretórios ao servir estáticos,
// mas o servidor por trás dele pode.
app.use('/static', express.static(path.join(__dirname, 'public-vulnerable'))); 
// Suponha que 'public-vulnerable' tenha arquivos e subdiretórios, e o servidor web
// permita a listagem se não houver um index.html

app.get('/', (req, res) => {
  res.send('Bem-vindo! <a href="/static/">Veja nossos arquivos estáticos</a>');
});

// ANTIPADRÃO: Mensagens de erro detalhadas em produção
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Em ambiente de desenvolvimento, isso é útil, mas NUNCA em produção:
  res.status(500).send(`Algo quebrou! Detalhes: ${err.message} \n ${err.stack}`); 
});