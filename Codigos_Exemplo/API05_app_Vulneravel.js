// app.js - Express.js (Vulnerável)
// ... (isAuthenticated e db simulado como antes) ...
db.users = { // Adicionando usuários para o exemplo
    'userA_id': { id: 'userA_id', username: 'userA', role: 'customer' },
    'userB_id': { id: 'userB_id', username: 'userB', role: 'customer' },
    'admin_id': { id: 'admin_id', username: 'admin', role: 'admin' }
};
db.deleteUser = (userId) => {
    if (db.users[userId]) {
        delete db.users[userId];
        return true;
    }
    return false;
};

// Endpoint administrativo supostamente "oculto" ou apenas para admins
app.delete('/api/admin/deleteUser/:userIdToDelete', isAuthenticated, (req, res) => {
  const userIdToDelete = req.params.userIdToDelete;
  
  // ANTIPADRÃO: Nenhuma verificação se o req.user.role é 'admin'.
  // Qualquer usuário autenticado pode chamar este endpoint se souber a URL.
  
  if (db.deleteUser(userIdToDelete)) {
    res.status(200).send(`User ${userIdToDelete} deleted.`);
  } else {
    res.status(404).send(`User ${userIdToDelete} not found.`);
  }
});