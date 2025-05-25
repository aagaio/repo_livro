// app.js - Express.js (Corrigido)
// ... (isAuthenticated e db simulado como antes) ...

// Middleware para verificar se o usuário é admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next(); // Usuário é admin, prosseguir
  } else {
    res.status(403).send('Forbidden: Administrator access required.');
  }
}

app.delete('/api/admin/deleteUser/:userIdToDelete', isAuthenticated, isAdmin, (req, res) => {
  // CORREÇÃO: O middleware 'isAdmin' já garantiu que apenas admins chegam aqui.
  const userIdToDelete = req.params.userIdToDelete;
  
  if (db.deleteUser(userIdToDelete)) {
    res.status(200).send(`User ${userIdToDelete} deleted.`);
  } else {
    res.status(404).send(`User ${userIdToDelete} not found.`);
  }
});