const helmet = require('helmet');
app.use(helmet()); // Adiciona diversos cabeçalhos de segurança
// Configurar HSTS, CSP, etc., conforme a necessidade.
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));