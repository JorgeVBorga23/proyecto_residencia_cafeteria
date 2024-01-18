const mongoose = require("mongoose");
require('dotenv').config();
function conectarBD() {
  mongoose.Promise = global.Promise;
 
  const connectionString = process.env.MONGODB_URI;

  // Conecta a la base de datos
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var db = mongoose.connection;

  db.on("error", function (err) {
    console.log("Error de conexión", err);
  });

  db.once("open", function () {
    console.log("Conexion realizada a la base de datos");
  });
}
module.exports = conectarBD;
