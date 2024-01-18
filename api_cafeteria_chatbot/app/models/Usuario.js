const mongoose = require("mongoose")

//modelo de los productos
const usuarioSchema = new mongoose.Schema({ 
    id: String, 
    nombreUsuario: String,
    password: String, 
    rol: String
},{timestamps: true})
const Usuario = mongoose.model('Usuarios', usuarioSchema)

module.exports = Usuario
