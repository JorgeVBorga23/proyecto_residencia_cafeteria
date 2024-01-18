const mongoose = require("mongoose")

//modelo de los productos
const mensajeEstadisticaScheme = new mongoose.Schema({
    mensaje: String,
    tipo: String,
    certezaDialogflow: mongoose.Types.Decimal128
}, {timestamps: true})
const MensajeEstadistica = mongoose.model('MensajesEstadisticas', mensajeEstadisticaScheme)
module.exports = MensajeEstadistica
