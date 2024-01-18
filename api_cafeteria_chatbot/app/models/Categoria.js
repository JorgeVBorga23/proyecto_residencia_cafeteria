const mongoose = require("mongoose")

//modelo de los productos
const categoriaSchema = new mongoose.Schema({ 
    id: Number, 
    nombre: String,
    imagen: String
}, {timestamps: true})
const Categoria = mongoose.model('Categorias', categoriaSchema)

module.exports = Categoria
