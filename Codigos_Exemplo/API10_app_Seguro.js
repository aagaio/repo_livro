// app.js - Express.js (Consumo Seguro de API Externa)
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// CORREÇÃO: Obter chave de API de variáveis de ambiente ou cofre de segredos
const EXTERNAL_API_KEY = process.env.GEO_API_KEY; 
const EXTERNAL_GEO_API_URL = 'https://api.geoservico.com/cep/';

if (!EXTERNAL_API_KEY) {
    console.error("FATAL: GEO_API_KEY não configurada!");
    process.exit(1);
}

app.post('/api/get-address', async (req, res) => {
  const { cep } = req.body;

  if (!cep || !/^\d{5}-?\d{3}$/.test(cep)) { // Validação mais robusta do formato do CEP
    return res.status(400).send('Formato de CEP inválido.');
  }
  const sanitizedCep = cep.replace('-', ''); // Sanitização básica

  try {
    const response = await axios.get(`${EXTERNAL_GEO_API_URL}${sanitizedCep}`, {
      params: { apiKey: EXTERNAL_API_KEY },
      timeout: 5000 // CORREÇÃO: Definir timeout para a chamada externa
    });
    
    // CORREÇÃO: Validar e sanitizar a resposta da API externa antes de usar
    if (response.status !== 200 || !response.data || typeof response.data !== 'object') {
        throw new Error('Resposta inválida do serviço de geolocalização');
    }
    
    const { logradouro, bairro, cidade, uf } = response.data; // Mapear apenas os campos esperados

    // Validar se os campos esperados existem e têm tipos corretos
    if (!logradouro || !cidade || !uf) {
        throw new Error('Dados de endereço incompletos do serviço de geolocalização');
    }

    // Criar um DTO de resposta para controlar o que é exposto
    const addressResponse = {
        street: String(logradouro).substring(0, 100), // Exemplo de sanitização/limitação
        neighborhood: String(bairro || '').substring(0, 50),
        city: String(cidade).substring(0, 50),
        state: String(uf).substring(0, 2)
    };

    res.json({
      message: "Endereço encontrado:",
      data: addressResponse
    });

  } catch (error) {
    console.error("Erro ao consumir API de geolocalização:", error.message, error.config ? error.config.url : '');
    // CORREÇÃO: Mensagem de erro genérica para o cliente
    res.status(502).send('Não foi possível obter as informações de endereço no momento. Tente novamente mais tarde.');
  }
});