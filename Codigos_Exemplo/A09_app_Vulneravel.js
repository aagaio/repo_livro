// logger.js (configuração do Winston)
const winston = require('winston');
const { combine, timestamp, json, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, timestamp, service, userId, ip }) => {
  return `${timestamp} [${service}] ${level}: ${userId ? `User(${userId}) ` : ''}${ip ? `IP(${ip}) ` : ''}${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json() // Ideal para ingestão por SIEMs
  ),
  defaultMeta: { service: 'minha-aplicacao-web' },
  transports: [
    // Em produção, configurar transportes para sistemas de log centralizados (ELK, Splunk, CloudWatch Logs etc.)
    new winston.transports.Console({
      format: combine(
        colorize(),
        myFormat // Formato mais legível para console em dev
      )
    }),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
  ],
});
module.exports = logger;

// Em app.js (ou em rotas/middlewares)
// const logger = require('./logger');
// ...
// app.post('/login', (req, res) => {
//   const { username } = req.body;
//   // ... lógica de autenticação ...
//   if (loginSucesso) {
//     logger.info('Login bem-sucedido', { userId: username, ip: req.ip });
//   } else {
//     logger.warn('Tentativa de login falhou', { usernameAttempt: username, ip: req.ip });
//   }
// });
//
// // Em um middleware de erro
// app.use((err, req, res, next) => {
//   logger.error('Erro não tratado na aplicação', { 
//     userId: req.user ? req.user.id : 'anonymous', 
//     ip: req.ip, 
//     path: req.path, 
//     method: req.method,
//     errorMessage: err.message, 
//     stack: err.stack 
//   });
//   res.status(500).send('Erro interno.');
// });