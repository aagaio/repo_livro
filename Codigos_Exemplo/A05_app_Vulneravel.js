// Em app.js, um error handler para desenvolvimento:
if (app.get('env') === 'development') { // Se NODE_ENV não for setado para 'production' na produção
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { // Supõe um template engine
      message: err.message,
      error: err // ANTIPADRÃO em produção: expõe stack trace
    });
  });
}