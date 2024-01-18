const mongoose = require("mongoose")

//modelo de los pedidos
const pedidoSchema = new mongoose.Schema({ 
    id: String, 
    idUsuario: String,
    productos: [
        { 
          idProducto: String,
          cantidad: Number,
          subtotal: Number,
          comentarios: String
        }
      ],
    total: Number,
    numeroCelular: String,
    metodoPago: String,
    direccionEnvio: String,
    status: String

}, {timestamps: true})
const Pedido = mongoose.model('Pedidos', pedidoSchema)

module.exports = Pedido
