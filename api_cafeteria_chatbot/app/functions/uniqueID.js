const { v4 } = require("uuid")

function generarIDUnica(nombre, fecha, hora){
    let claveUnica = v4()
    let id = nombre + fecha + hora + claveUnica
    return id
}
module.exports = { generarIDUnica }

