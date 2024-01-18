const mongoose = require("mongoose")

//modelo del carrito
const carritoSchema = new mongoose.Schema({
    identificador: String,
    productos: [
      { 
        idProducto: String,
        cantidad: Number,
        subtotal: Number,
        comentarios: String
      }
    ],
    total: Number
  }, {timestamps: true})
  
const Carrito = mongoose.model('Carritos', carritoSchema)
module.exports = Carrito