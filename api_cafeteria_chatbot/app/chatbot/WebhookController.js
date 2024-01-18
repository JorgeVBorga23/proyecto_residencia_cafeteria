const express = require("express");
const router = express.Router();
const {
  responderCategorias,
  responderProductosCategorias,
  responderDetalleProducto,
  agregarCarrito,
  verCarrito,
  eliminarProductoCarrito,
} = require("./functions/functions");

const { v4 } = require("uuid");
const { realizarPedido, pedirCelular, confirmarCodigo} = require("./functions/funcionesDePedido");

router.get("/token", async (req, res) => {
  if (global.tokenCarrito) {
    res.json({ token: global.tokenCarrito });
  } else {
    res.json({ mensaje: "el token no se genero" });
  }
});

router.post("/", async (req, res) => {
  //verificamsos que intent esta enviando la peticion
  const { queryResult } = req.body;
  const nombreIntent = queryResult.intent.displayName;
  switch (nombreIntent) {
    case "Menu":
      await responderCategorias(req, res);

      break;
    case "VerProductosCategoria":
      await responderProductosCategorias(req, res);

      break;
    case "DetalleProducto":
      await responderDetalleProducto(req, res);

      break;
    case "CapturarCantidadProducto":
      await agregarCarrito(req, res);
      break;

    case "VerCarrito":
      await verCarrito(req, res)
      break;

    case "EliminarProductoCarrito":
      await eliminarProductoCarrito(req, res)  
    break

    case "RealizarPedido":
    await realizarPedido(req, res)
    break

    case "RealizarPedido-celular":
    await pedirCelular(req, res)
    break

    case "RealizarPedido-celular-codigo":
      await confirmarCodigo(req, res)
    break

    case "InicioConversacion":
      //traemos la sesion
      const session = req.body.session;
      const sessionArray = session.split("/");
      const projectID = sessionArray[1];
      const sessionID = sessionArray[4];
      //vamos a verificar si existe un token
      // Obtener contextos de Dialogflow
      const outputContexts = req.body.queryResult.outputContexts || [];
      // Verificar si existe un contexto con información del token
      const contextoConToken = outputContexts.find((contexto) => {
        return contexto.name.endsWith("/tokenContext");
      });
      if (!contextoConToken) {
        const nuevoToken = v4();
        res.json({
          outputContexts: [
            {
              name: `projects/${projectID}/agent/sessions/${sessionID}/contexts/tokenContext`,
              lifespanCount: 200,
              parameters: {
                token: nuevoToken,
              },
            },
          ],
        });
        global.tokenCarrito = nuevoToken;
      }
      break;
  }
});

module.exports = router;
