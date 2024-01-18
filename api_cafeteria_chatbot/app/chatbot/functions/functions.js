const Categoria = require("../../models/Categoria");
const Producto = require("../../models/Producto");
const MensajeEstadistica = require("../../models/MensajeEstadistica")
const axios = require("axios");


//funcion para guardar mensaje
const guardarMensaje = (req, tipo) => {
  try {
    //guardamos el mensaje para estadistica
    const queryText = req.body.queryResult.queryText
    const porcentajeCertezaDialogflow = req.body.queryResult.intentDetectionConfidence
    const datos = {
      mensaje: queryText,
      tipo: tipo,
      certezaDialogflow: porcentajeCertezaDialogflow
    }
    const mensajeNuevo = new MensajeEstadistica(datos)
    mensajeNuevo.save().then(() => {
      console.log("mensaje guardado correctamente")
    })
  } catch (error) {
    console.log("Error guardando mensaje de estadistica " + error)
  }
}

const responderCategorias = async (req, res) => {
  //traernos las categorias
  try {
    const arregloCat = await Categoria.find({});
    if (arregloCat) {
      // Construye tarjetas individuales para cada categoría
      const tarjetasCategorias = arregloCat.map((categoria) => {
        return [
          
          {
            type: "image",
            rawUrl: "http://recuerdosdeorizaba.ddns.net:3001" + categoria.imagen,
            accessibilityText: "imagen de categoria" + categoria.nombre
          },

          {
            type: "info",
            title: categoria.nombre
          },
          { type: "chips", options: [{ text: "Ver " + categoria.nombre }] },
        ];
      });

      // Enviar la respuesta a Dialogflow con tarjetas individuales
      res.json({
        fulfillmentMessages: [
          {
            payload: {
              richContent: tarjetasCategorias,
            },
          },
        ],
      });
    } else {
      console.log(
        "Ocurrio un error en el if categorias, al parecer no existen"
      );
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

const responderProductosCategorias = async (req, res) => {
  //vamos a traernos el parametro obtenido
  const paramCategoria = await req.body.queryResult.parameters.categoria;
  try {
    let categoriaBD = await Categoria.findOne({ nombre: paramCategoria }) || 0;
    let listadoProductos = await Producto.find({ categoria: categoriaBD.id });

    if (!listadoProductos.length) {
      res.json({
        fulfillmentMessages: [
          {
            payload: {
              richContent: [
                [{
                  type: "info",
                  title: "Ups! Lo lamento!",
                  subtitle: "Parece que no hay alimentos para esta categoria, puedes intentar con otra!"
                },
                {
                  type: "chips",
                  options: [
                    { text: "Ver menu" }
                  ]
                }
                ]
              ]
            }
          }
        ]
      })
      guardarMensaje(req, "CATEGORIA INEXISTENTE")

    } else {
      const tarjetasProductos = listadoProductos.map((producto) => {
        return [
          {
            type: "image",
            rawUrl:
              "http://recuerdosdeorizaba.ddns.net:3001"+producto.imagen,
            accessibilityText: "Imagen del producto " + producto.nombre,
          },
          {
            type: "info",
            title: producto.nombre,
            subtitle: "$" + producto.precio
          },
          {
            type: "chips",
            options: [
              {
                text: "Ver Más " + producto.nombre,
              },
              {
                text: "Agregar al Carrito " + producto.nombre,
                postback: "AGREGAR_AL_CARRITO_PRODUCTO_1",
              },
            ],
          },
        ];
      });
      const respuesta = {
        fulfillmentMessages: [
          {
            payload: {
              richContent: tarjetasProductos,
            },
          },
        ],
      };

      res.json(respuesta);
    }

  } catch (error) {
    console.log(error);
  }
};

const responderDetalleProducto = async (req, res) => {
  const nombreProd = req.body.queryResult.parameters.Producto;
  const producto = await Producto.findOne({ nombre: nombreProd });
  if (!producto) {
    res.json(
      {
        fulfillmentMessages: [
          {
            payload: {
              richContent: [
                [{
                  type: "info",
                  title: "Ups! Lo siento!",
                  subtitle: "Parece que no me has proporcionado un alimento valido para ver sus detalles"
                },
                {
                  type: "chips",
                  options: [
                    { text: "Ver menu" }
                  ]
                }
                ]
              ]
            }
          }
        ]
      }
    )
    guardarMensaje(req, "PRODUCTO INEXISTENTE")
  } else {
    const respuesta = {
      fulfillmentMessages: [
        {
          payload: {
            richContent: [
              [
                {
                  type: "image",
                  rawUrl:
                    "http://recuerdosdeorizaba.ddns.net:3001"+producto.imagen,
                  accessibilityText: "Imagen del producto " + nombreProd,
                },
                {
                  type: "description",
                  title: producto.nombre,
                  text: [producto.descripcion, "$" + producto.precio],
                },
                {
                  type: "chips",
                  options: [
                    {
                      text: "Añadir al carrito " + producto.nombre,
                    },
                  ],
                },
              ],
            ],
          },
        },
      ],
    };
    res.json(respuesta);
  }
};

const agregarCarrito = async (req, res) => {
  const { queryResult } = req.body;
  const cantidad = queryResult.parameters.Cantidad;
  const producto = queryResult.outputContexts[0].parameters.Producto;

  const contextCarrito = queryResult.outputContexts.find((contexto) => {
    return contexto.name.endsWith("/tokencontext");
  });

  const token = contextCarrito.parameters.token;

  console.log(token);
  const prod = await Producto.findOne({ nombre: producto });
  const apiUrl = "http://recuerdosdeorizaba.ddns.net:3001/carrito/guardar";
  // verificamos si existe un producto que guardar
  if (!prod) {
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [
              [{
                type: "info",
                title: "Ups! Lo lamento!",
                subtitle: "Parece que no existe el alimento que deseas agregar al carrito!"
              },
              {
                type: "chips",
                options: [
                  { text: "Ver menu" }
                ]
              }
              ]
            ]
          }
        }
      ]
    })
    guardarMensaje(req, "PRODUCTO INEXISTENTe")

  } else {
    const data = {
      identificador: token,
      idProducto: prod.id,
      cantidad: cantidad,
    };
    try {
      const response = await axios.post(apiUrl, data);
      console.log("Respuesta del servidor:", response.data);
      res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ["Agregaste un producto a tu carrito!"],
            },
          },
          {
            payload: {
              richContent: [
                [
                  {
                    type: "description",
                    title: producto,
                    text: [
                      "$" + prod.precio,
                      "Agregaste: " + cantidad,
                      "Tu total hasta el momento: $" + response.data.total,
                    ],
                  },
                ],
                [
                  {
                    type: "chips",
                    options: [
                      {
                        text: "Ver Menú",
                      },
                      {
                        text: "Ver Carrito",
                      },
                      {
                        text: "Realizar Pedido",
                      },
                    ],
                  },
                ],
              ],
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  }
};

const verCarrito = async (req, res) => {
  //vamos a recuperar igualmente el identificador del carrito
  const { queryResult } = req.body;
  const contextCarrito = queryResult.outputContexts.find((contexto) => {
    return contexto.name.endsWith("/tokencontext");
  });

  const token = contextCarrito.parameters.token;

  //vamos a traernos el carrito de la bd
  const apiUrl = "http://recuerdosdeorizaba.ddns.net:3001/carrito/consultar/" + token;
  try {
    const response = await axios.get(apiUrl);
    const carrito = response.data;
    if (response.data.mensaje || !carrito.productos.length) {
      res.json({
        fulfillmentMessages: [
          {
            payload: {
              richContent: [
                [
                  {
                    type: "info",
                    title: "Ups!",
                    subtitle:
                      "¡Parece que no has agregado ningun alimento en tu carrito!",
                    text: [
                      "Explora nuestro delicioso menú y descubre opciones increíbles.",
                    ],
                  },
                ],
                [
                  {
                    type: "chips",
                    options: [
                      {
                        text: "Ver Menú",
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
      //generamos dinamicamente cada tarjeta en cada producto del carrito:
      const tarjetasInfo = await Promise.all(response.data.productos.map(async producto => {
        // Recupera el producto de la base de datos utilizando el ID
        const productoEncontrado = await Producto.findOne({ id: producto.idProducto });
        // Verifica si el producto se encontró antes de continuar
        if (productoEncontrado) {
          // Crea la tarjeta de información y chips utilizando los datos del producto
          return [
            {
              type: "description",
              title: productoEncontrado.nombre,
              text: ["Precio: $" + productoEncontrado.precio, "Cantidad: " + producto.cantidad, "Subtotal: $" + producto.subtotal]
            },
            {
              type: "chips",
              options: [
                {
                  text: `Eliminar ${productoEncontrado.nombre}`,
                  postback: `Eliminar: ${productoEncontrado.nombre}`,
                },
              ],
            },
          ];
        } else {
          // Maneja el caso en el que el producto no se encuentra
          console.log(`No se encontró un producto con ID ${producto.id}`);
          return null; // o algún valor por defecto según tus necesidades
        }
      }));
      // Filtra las tarjetasInfo para eliminar elementos nulos (productos no encontrados)
      const tarjetasInfoFiltradas = tarjetasInfo.filter(Boolean);
      res.json({
        fulfillmentMessages: [
          {
            payload: {
              richContent: [
                [
                  {
                    type: "info",
                    title: "Carrito de Compras",
                    subtitle: "Productos en tu carrito:",
                  },
                ],
                [
                  {
                    type: "divider",
                  },
                ],
                ...tarjetasInfoFiltradas,
                [
                  {
                    type: "chips",
                    options: [
                      {
                        text: "Ver Menú",
                      },
                      {
                        text: "Pagar",
                      },
                    ],
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
};

const eliminarProductoCarrito = async (req, res) => {
  //vamos a ver si existe un identificador 
  const { queryResult } = req.body;
  const contextCarrito = queryResult.outputContexts.find((contexto) => {
    return contexto.name.endsWith("/tokencontext");
  });
  const token = contextCarrito.parameters.token;
  if (token) {
    try {
      //recuperamos el nombre del producto que quiere eliminar
      const nombreProducto = req.body.queryResult.parameters.Producto
      const productoID = await Producto.findOne({ nombre: nombreProducto })
      //vamos a enviar el id del producto y el token para eliminar del carrito
      const apiUrl = `http://recuerdosdeorizaba.ddns.net:3001/carrito/${token}/${productoID.id}`
      axios.delete(apiUrl)
        .then(() => {
          res.json({
            fulfillmentMessages: [
              {
                payload: {
                  richContent: [[
                    {
                      type: "info",
                      title: "Producto eliminado de tu carrito!",
                      subtitle: "Eliminast el producto: " + nombreProducto
                    }
                  ],
                  [
                    {
                      type: "chips",
                      options: [{
                        text: "Ver Carrito"
                      }, {
                        text: "Ver Menu"
                      }]
                    }
                  ]]
                }
              }
            ]
          })
        }).catch((error) => { console.log(error) })
    } catch (error) {
      console.log(error)
    }
  } else {
    res.json({
      fulfillmentMessages: [
        {
          payload: {
            richContent: [[
              {
                type: "info",
                title: "Ups! parece que ocurrio un error al recuperar el carrito!",
                subtitle: "Por favor si el problema persiste, contacte con soporte tecnico"
              }
            ]]
          }
        }
      ]
    })
  }
}


module.exports = {
  responderCategorias,
  responderProductosCategorias,
  responderDetalleProducto,
  agregarCarrito,
  verCarrito,
  eliminarProductoCarrito,
};
