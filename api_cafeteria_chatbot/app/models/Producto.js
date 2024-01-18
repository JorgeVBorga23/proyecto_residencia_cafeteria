const mongoose = require("mongoose")

//modelo de los productos
const productoSchema = new mongoose.Schema({ 
    id: String, 
    nombre: String,
    categoria: Number, 
    precio: Number, 
    stock: Number, 
    imagen: String,
    descripcion: String
}, {timestamps: true})
const Producto = mongoose.model('Productos', productoSchema)

module.exports = Producto
