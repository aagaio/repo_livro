// Em app.js, error handler diferenciado para produção:
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // Logar o erro completo no servidor
  console.error(err.stack); 
  if (app.get('env') === 'production') {
    res.send('Ocorreu um erro inesperado.'); // Mensagem genérica para produção
  } else {
    res.send(`Erro: ${err.message}<br><pre>${err.stack}</pre>`); // Detalhes em dev
  }
});
// Certificar-se que NODE_ENV é 'production' no ambiente de produção.