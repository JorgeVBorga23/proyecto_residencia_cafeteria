const mongoose = require("mongoose")

// Definir un esquema para la colección de códigos
const codigoSchema = new mongoose.Schema({
    numeroTelefono: { type: String, required: true },
    codigo: { type: String, required: true },
    token: {type: String, required: true}
  });
  
  // Crear un modelo basado en el esquema
  const Codigo = mongoose.model('Codigo', codigoSchema);

  module.exports = Codigo

  