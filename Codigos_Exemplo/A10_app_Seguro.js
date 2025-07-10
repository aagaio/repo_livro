// app.js - Express.js (Corrigido contra SSRF)
const express = require('express');
const axios = require('axios');
const { URL } = require('url'); // Para parsear e validar URLs
const dns = require('dns').promises; // Para resolver IPs e checar se são privados
const ipaddr = require('ipaddr.js'); // Para checar se um IP é privado/loopback

const app = express();

// CORREÇÃO: Lista de permissão de domínios/hosts confiáveis para buscar imagens
const ALLOWED_IMAGE_HOSTS = ['images.example.com', 'cdn.example-cdn.com'];

async function isPrivateIp(hostname) {
    try {
        const { address } = await dns.lookup(hostname); // Resolve o hostname para IP
        const addr = ipaddr.parse(address);
        // Bloqueia loopback, link-local, e IPs privados (RFC1918)
        return addr.range() === 'loopback' || addr.range() === 'linkLocal' || addr.range() === 'private';
    } catch (err) {
        console.error("DNS lookup failed:", err);
        return true; // Considerar falha na resolução como potencialmente perigoso
    }
}

app.get('/fetch-image-secure', async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send('Parâmetro "url" da imagem é obrigatório.');
  }

  try {
    const parsedUrl = new URL(imageUrl);

    // CORREÇÃO: Validar o protocolo (permitir apenas http/https)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).send('Protocolo de URL inválido. Apenas HTTP e HTTPS são permitidos.');
    }

    // CORREÇÃO: Validar contra a lista de permissão de hosts
    if (!ALLOWED_IMAGE_HOSTS.includes(parsedUrl.hostname)) {
      return res.status(403).send('Host não permitido para busca de imagem.');
    }
    
    // CORREÇÃO: Checagem adicional para evitar que o hostname permitido resolva para um IP interno
    if (await isPrivateIp(parsedUrl.hostname)) {
        return res.status(403).send('Destino da URL resolve para um endereço de rede restrito.');
    }

    const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 5000, // Prevenir DoS por conexões lentas
        maxRedirects: 0 // CORREÇÃO: Desabilitar ou controlar redirecionamentos
    });
    
    // Validar o tipo de conteúdo da resposta para garantir que é uma imagem
    const contentType = imageResponse.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
         return res.status(400).send('A URL fornecida não retornou uma imagem válida.');
    }

    res.set('Content-Type', contentType);
    res.send(imageResponse.data);

  } catch (error) {
    console.error(`SSRF Secure Error fetching ${imageUrl}:`, error.message);
    res.status(500).send('Erro ao buscar a imagem da URL. Tente novamente mais tarde.');
  }
});