// middleware/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido' });
    }
    req.usuario = usuario;
    next();
  });
}

module.exports = verificarToken;
