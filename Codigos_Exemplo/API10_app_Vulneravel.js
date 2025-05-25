// app.js - Express.js (Consumo Inseguro de API Externa)
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ANTIPADRÃO: Chave de API codificada diretamente no código
const EXTERNAL_API_KEY = 'minha_chave_secreta_da_api_externa'; 
const EXTERNAL_GEO_API_URL = 'https://api.geoservico.com/cep/';

app.post('/api/get-address', async (req, res) => {
  const { cep } = req.body;

  if (!cep || !/^\d{8}$/.test(cep)) { // Validação básica do formato do CEP
    return res.status(400).send('CEP inválido.');
  }

  try {
    // ANTIPADRÃO: Envia o input do usuário diretamente para a API externa sem sanitização adicional
    // ou sem considerar o que fazer se a API externa estiver offline ou retornar um erro inesperado.
    const response = await axios.get(`${EXTERNAL_GEO_API_URL}${cep}?apiKey=${EXTERNAL_API_KEY}`);
    
    // ANTIPADRÃO: Confia implicitamente nos dados retornados e os usa diretamente.
    // Se response.data contiver scripts ou estruturas maliciosas, e isso for refletido no frontend,
    // pode levar a XSS ou outros problemas.
    const addressData = response.data; 

    res.json({
      message: "Endereço encontrado:",
      data: addressData // Expor todos os dados da API externa pode ser demais
    });

  } catch (error) {
    // ANTIPADRÃO: Pode vazar informações sobre a API externa ou a chave
    console.error("Erro ao buscar API externa:", error.message);
    // Se error.response.data contiver informações sensíveis, não deve ser refletido ao cliente.
    res.status(500).send('Erro ao consultar o serviço de geolocalização.');
  }
});