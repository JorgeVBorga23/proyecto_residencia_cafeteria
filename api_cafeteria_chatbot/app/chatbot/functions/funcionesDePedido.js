const Codigo = require("../../models/CodigoSMS");
const axios = require("axios");
const {enviarMensaje} = require("../../functions/twilio")

async function realizarPedido(req, res) {
  //vamos a ver si el carrito tiene productos, si no tiene, indicar que no se puede avanzar por no existir productos
  const { queryResult } = req.body;
  const contextCarrito = queryResult.outputContexts.find((contexto) => {
    return contexto.name.endsWith("/tokencontext");
  });

  const token = contextCarrito.parameters.token;
  if (token) {
    const apiUrl = "http://localhost:3001/carrito/consultar/" + token;
    try {
      const peticion = await axios.get(apiUrl);
      if (peticion.data.mensaje) {
        res.json({
          fulfillmentMessages: [
            {
              payload: {
                richContent: [
                  [
                    {
                      type: "info",
                      title: "Vaya! No podemos realizar tu pedido!",
                      subtitle:
                        "No hay elementos aun en tu carrito para realizar un pedido!",
                    },
                  ],
                  [
                    {
                      type: "chips",
                      options: [
                        {
                          text: "Ver Menu",
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        });
      } else {
        //existe productos y si se puede realizar pedido, ahora pedir un numero de celular para confirmar el pedido
        //enviar un contexto para indicar que estamos realizando un pedido

        res.json({
          fulfillmentMessages: [
            {
              payload: {
                richContent: [
                  [
                    {
                      type: "info",
                      title:
                        "Muy Bien! primero que nada necesitamos confirmar tu pedido",
                      subtitle:
                        "Por favor proporcionanos un numero celular de 10 digitos para enviar un codigo de confirmación",
                    },
                  ],
                ],
              },
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [
              [
                {
                  type: "info",
                  title:
                    "Ups! parece que ocurrio un error al recuperar el carrito para realizar el pedido!",
                  subtitle:
                    "Por favor si el problema persiste, contacte con soporte tecnico",
                },
              ],
            ],
          },
        },
      ],
    });
  }
}

async function pedirCelular(req, res) {
  //recuperamos el numero celular
  const { queryResult } = req.body;
  const numeroCelular = queryResult.parameters.numerocelular;
  const contextCarrito = queryResult.outputContexts.find((contexto) => {
    return contexto.name.endsWith("/tokencontext");
  });

  const token = contextCarrito.parameters.token;

  const expresionRegular = /^\d{10}$/;

  if (expresionRegular.test(numeroCelular)) {
    await enviarMensaje(numeroCelular, token)
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [ 
              [
                {
                  type: "info",
                  title:
                    "Hemos enviado un codigo al numero que indicaste!",
                  subtitle:
                    "Por favor ingresa el codigo de confirmacion de 5 digitos para confirmar tu compra",
                },
              ],
            ],
          },
        },
      ],
    });
  } else {
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [
              [
                {
                  type: "info",
                  title:
                    "Ups! parece que ingresaste un numero de celular invalido!",
                  subtitle:
                    "Recuerda que debe tener 10 digitos",
                },
              ],
            ],
          },
        },
      ],
    });
  }
 
 
}

async function confirmarCodigo(req, res){

  //recuperamos el numero celular
  const { queryResult } = req.body;
  const numeroCelular = queryResult.outputContexts[0].parameters.numerocelular
  const contextCarrito = queryResult.outputContexts.find((contexto) => {
    return contexto.name.endsWith("/tokencontext");
  });

  const token = contextCarrito.parameters.token;
  
  //verificamos el celular, token y codigo que ingreso el usuario
  if(validarCodigo(numeroCelular, queryResult.parameters.number, token)){
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [
              [
                {
                  type: "info",
                  title:
                    "Muchas gracias por confirmar tu pedido!",
                  subtitle:
                    "Ahora necesitamos saber como vas a querer que te entreguemos tu pedido",
                },
                {
                  type: "chips",
                  options: [{name: "Envio a domicilio"}, {name: "Entrega en mostrador"}, {name: "Entrega en mesa"}]
                }
              ],
            ],
          },
        },
      ],
    });
  }else{
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [
              [
                {
                  type: "info",
                  title:
                    "El codigo que ingresaste no es correcto",
                  subtitle:
                    "Intenta realizar de nuevo el pedido!",
                },
              ],
            ],
          },
        },
      ],
    });
  }
}

  // Lógica para validar el código ingresado
  const validarCodigo = async (numeroTelefono, codigoIngresado, token) => {
    // Buscar el código en la base de datos
    const codigoEncontrado = await Codigo.findOne({ numeroTelefono, codigo: codigoIngresado, token });
   console.log(numeroTelefono, codigoIngresado, token, codigoEncontrado)
    // Verificar si el código es válido
    return codigoEncontrado !== null;
  }

module.exports = { realizarPedido, pedirCelular, confirmarCodigo };
