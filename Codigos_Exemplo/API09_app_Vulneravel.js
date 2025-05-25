// app.js - Exemplo de roteamento versionado
const express = require('express');
const app = express();

const v1Routes = require('./routes/v1/api'); // Rotas da v1
const v2Routes = require('./routes/v2/api'); // Rotas da v2

// Documentação da API (ex: usando Swagger/OpenAPI)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Roteamento versionado
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// TODO: Implementar um plano para desativar formalmente /api/v1 após um período de depreciação
// e comunicar essa desativação aos consumidores.