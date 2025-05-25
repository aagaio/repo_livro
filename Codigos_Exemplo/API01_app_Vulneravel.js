// Rota Vulnerável em Express.js
app.get('/api/financials/:userId', (req, res) => {
  const requestedUserId = req.params.userId;
  // Supõe-se que o usuário está autenticado, mas não verifica se
  // o usuário autenticado (ex: req.user.id) é igual a requestedUserId
  // ou se tem permissão para ver os dados de requestedUserId.

  // Busca diretamente os dados financeiros do requestedUserId
  db.getFinancialData(requestedUserId, (err, data) => {
    if (err) {
      return res.status(500).send('Error fetching data');
    }
    if (!data) {
      return res.status(404).send('User not found');
    }
    res.json(data);
  });
});