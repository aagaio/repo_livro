// app.js - Express.js (Vulnerável a SSRF)
const express = require('express');
const axios = require('axios'); // Para fazer requisições HTTP
const app = express();

app.get('/api/fetch-url-data', async (req, res) => {
  const urlToFetch = req.query.url; // URL fornecida pelo usuário

  if (!urlToFetch) {
    return res.status(400).send('URL parameter is missing.');
  }

  try {
    // ANTIPADRÃO: A aplicação faz uma requisição para qualquer URL fornecida pelo usuário
    // sem validação ou restrição do destino.
    const response = await axios.get(urlToFetch);
    // Processa e retorna 'response.data' (ex: título da página, imagem)
    res.send(`Data fetched from ${urlToFetch}: ${response.status}`); 
  } catch (error) {
    res.status(500).send(`Error fetching URL: ${error.message}`);
  }
});