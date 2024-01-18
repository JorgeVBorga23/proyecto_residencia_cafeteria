const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const Pedido = require("../models/Pedido");
const { uuid } = require("uuidv4");

//obtener todos los productos
router.get("/", async (req, res) => {
  let pedidos = await Pedido.find({});
  res.send(pedidos);
});

//obtener un pedido
router.get("/id", async function (req, res) {
  let result = await Pedido.findOne({ id: req.params.id });
  if (result) {
    res.json(result);
  } else {
    res.json({ mensaje: "No se encontro un pedido con este ID" });
  }
});

//generar un pedido
router.post("/", async function (req, res) {
  try {
    let data = req.body;
    if (
      !data.idUsuario ||
      !data.productos ||
      !data.total ||
      !data.numeroCelular ||
      !data.metodoPago ||
      !data.direccionEnvio
    ) {
      res.json({ mensaje: "El pedido tiene valores vacios" });
    } else {
      //guardamos el pedido

      const pedido = {
        id: uuid(),
        idUsuario: data.idUsuario,
        productos: data.productos,
        total: data.total,
        numeroCelular: data.numeroCelular,
        metodoPago: data.metodoPago,
        direccionEnvio: data.direccionEnvio,
        status: data.status,
      };
      let nuevoPedido = new Pedido(pedido)
      nuevoPedido.save().then(() =>
      res.json({
          mensaje: "Pedido guardado correctamente",
          id: nuevoPedido.id
      }))
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
