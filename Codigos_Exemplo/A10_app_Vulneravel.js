// app.js - Express.js (Vulnerável a SSRF)
const express = require('express');
const axios = require('axios'); // Biblioteca para fazer requisições HTTP
const app = express();

app.get('/fetch-image', async (req, res) => {
  const imageUrl = req.query.url; // URL da imagem fornecida pelo usuário via query string

  if (!imageUrl) {
    return res.status(400).send('Parâmetro "url" da imagem é obrigatório.');
  }

  try {
    // ANTIPADRÃO: A aplicação faz uma requisição GET para qualquer URL fornecida pelo usuário.
    // Não há validação do host, porta ou esquema da URL.
    const imageResponse = await axios.get(imageUrl, { 
        responseType: 'arraybuffer', // Para tratar como dados binários
        timeout: 5000 // Adicionando um timeout básico
    });
    
    // Supostamente, aqui o servidor processaria ou retornaria a imagem.
    // Por exemplo, definir o content-type e enviar os dados.
    // res.set('Content-Type', imageResponse.headers['content-type']);
    res.send(`Imagem de ${imageUrl} buscada com status: ${imageResponse.status}. (Conteúdo não exibido por simplicidade)`);

  } catch (error) {
    // Mensagens de erro podem vazar informações sobre a rede interna se o alvo for interno
    console.error(`SSRF Error fetching ${imageUrl}:`, error.message);
    res.status(500).send(`Erro ao buscar a imagem da URL: ${error.message}`);
  }
});