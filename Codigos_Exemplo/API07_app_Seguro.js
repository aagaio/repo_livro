// app.js - Express.js (Corrigido contra SSRF)
const express = require('express');
const axios = require('axios');
const { URL } = require('url'); // Para parsear e validar URLs
const app = express();

// CORREÇÃO: Lista de permissão de domínios
const ALLOWED_DOMAINS = ['example.com', 'anotherexample.org']; 
// Ou uma lista de IPs/redes internas que NUNCA devem ser acessadas

app.get('/api/fetch-url-data', async (req, res) => {
  const urlToFetch = req.query.url;

  if (!urlToFetch) {
    return res.status(400).send('URL parameter is missing.');
  }

  try {
    const parsedUrl = new URL(urlToFetch);

    // CORREÇÃO: Validar o protocolo (permitir apenas http/https)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).send('Invalid URL protocol.');
    }

    // CORREÇÃO: Validar contra a lista de permissão de domínios
    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      // Ou, alternativamente, verificar se o IP resolvido é um IP privado/loopback e bloquear
      // (requer resolução de DNS e checagem de IP, mais complexo)
      return res.status(403).send('Forbidden: Access to this domain is not allowed.');
    }
    
    // Considerar usar um proxy HTTP configurado para apenas acessar a internet externa,
    // ou bibliotecas com proteções SSRF embutidas.
    const response = await axios.get(urlToFetch, {
        timeout: 5000, // CORREÇÃO: Adicionar timeout
        // Opções adicionais para restringir redirecionamentos, etc.
    });
    res.send(`Data fetched from ${parsedUrl.hostname}: ${response.status}`);
  } catch (error) {
    // Logar o erro detalhado no servidor, mas retornar mensagem genérica ao cliente
    console.error("SSRF attempt or fetch error:", error);
    res.status(500).send('Error fetching URL.');
  }
});