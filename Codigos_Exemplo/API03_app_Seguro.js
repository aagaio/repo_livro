// app.js - Express.js (Corrigido)
// ... (isAuthenticated e db simulado como antes) ...
db.users = {
  'userA_id': { id: 'userA_id', username: 'userA', email: 'usera@example.com', role: 'customer', internalNote: 'xyz' },
  'admin_id': { id: 'admin_id', username: 'admin', email: 'admin@example.com', role: 'admin', internalNote: 'abc' }
};

// Função de atualização segura
db.updateUserProfile = (userId, profileData) => {
  if (db.users[userId]) {
    // CORREÇÃO: Atualizar apenas campos permitidos
    if (profileData.email) db.users[userId].email = profileData.email;
    // if (profileData.username) db.users[userId].username = profileData.username; // Exemplo de outro campo permitido
    // O campo 'role' não é atualizado aqui por um usuário comum
    return db.users[userId];
  }
  return null;
};

// DTO de resposta (o que o cliente deve ver)
function userResponseDTO(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email
        // Não inclui 'role' ou 'internalNote'
    };
}

app.put('/api/users/me', isAuthenticated, (req, res) => {
  const authenticatedUserId = req.user.id;
  // CORREÇÃO: Extrair apenas os campos esperados e permitidos do corpo da requisição
  const { email /*, outros campos permitidos */ } = req.body;
  const profileDataToUpdate = { email /*, outros campos permitidos */ };

  const userToUpdate = db.users[authenticatedUserId];
  if (!userToUpdate) {
      return res.status(404).send('User not found');
  }

  // Se a atualização de papel fosse permitida apenas para admins:
  // if (req.user.role === 'admin' && req.body.role && userToUpdate.id === req.params.targetUserId) {
  //   userToUpdate.role = req.body.role;
  // }

  const updatedUser = db.updateUserProfile(authenticatedUserId, profileDataToUpdate);

  if (!updatedUser) {
    return res.status(404).send('User not found or update failed');
  }
  // CORREÇÃO: Retornar um DTO com dados filtrados
  res.json(userResponseDTO(updatedUser)); 
});