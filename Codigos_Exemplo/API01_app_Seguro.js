// Rota Corrigida em Express.js
app.get('/api/financials/:userId', isAuthenticated, (req, res) => { // isAuthenticated é um middleware de autenticação
  const requestedUserId = parseInt(req.params.userId, 10); // Converter para número
  const authenticatedUserId = req.user.id; // ID do usuário autenticado (ex: vindo do JWT)
  const userRole = req.user.role; // Papel do usuário autenticado

  // Verificação de Autorização em Nível de Objeto
  if (authenticatedUserId !== requestedUserId && userRole !== 'admin') {
    return res.status(403).send('Forbidden: You do not have permission to access this resource.');
  }

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