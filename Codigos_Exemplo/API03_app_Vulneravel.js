// app.js - Express.js
// ... (isAuthenticated e db simulado como antes) ...
// Adicionar usuários ao db simulado
db.users = {
  'userA_id': { id: 'userA_id', username: 'userA', email: 'usera@example.com', role: 'customer' },
  'admin_id': { id: 'admin_id', username: 'admin', email: 'admin@example.com', role: 'admin' }
};
db.updateUser = (userId, data) => {
  if (db.users[userId]) {
    // ANTIPADRÃO: Atribuição em massa de todas as propriedades recebidas
    Object.assign(db.users[userId], data);
    return db.users[userId];
  }
  return null;
};

app.put('/api/users/me', isAuthenticated, (req, res) => {
  const authenticatedUserId = req.user.id; // ID do usuário autenticado
  const updateData = req.body; // Dados enviados pelo cliente

  // ANTIPADRÃO: Usuário 'customer' pode enviar { "role": "admin" } no corpo da requisição
  // e a função db.updateUser irá atualizar o papel indevidamente.
  const updatedUser = db.updateUser(authenticatedUserId, updateData);

  if (!updatedUser) {
    return res.status(404).send('User not found');
  }
  // ANTIPADRÃO: Retorna o objeto de usuário completo, incluindo o campo 'role'
  // que pode ter sido modificado ou que o cliente não precisa ver.
  res.json(updatedUser); 
});