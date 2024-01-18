const express = require("express");
const router = express.Router();
const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");
const { uuid } = require("uuidv4");

/*
TO DO:
1. verificar si un producto que se esta guardando ya esta almacenado en un carrito, evitar que se guarde
como nuevo registro, en su lugar, actualizar la cantidad, subtotal y total del carrito

2. verificar que el subtotal y total del carrito y cada item, se calcule antes de guardarse en la bd,
y el calculo debe ser hecho desde codigo

3. Eliminar productos del carrito con el id del producto
*/

//guardar un producto
router.post("/guardar/", async (req, res) => {
  //pedimos el id para comprobar si existe el carrito
  let result = await Carrito.findOne({ identificador: req.body.identificador });
  if (result) {
    //verificamos que exista un producto que guardar
    const idProduct = req.body.idProducto;
    if (!idProduct == "") {
      //comprobar que el producto exista dentro de la bd
      let productResult = await Producto.findOne({ id: idProduct });
      if (productResult) {
        //existe el producto y existe el carrito, vamos a agregar el producto al carrito
        const subtotalCalculado = productResult.precio * req.body.cantidad;
        const arregloDeProductos = result.productos
        let totalAcumulado = 0
        arregloDeProductos.forEach((pro) => {
          totalAcumulado += pro.subtotal
        })

        let update = await Carrito.updateOne(
          { identificador: req.body.identificador },
          {
            $addToSet: {
              productos: {
                idProducto: req.body.idProducto,
                cantidad: req.body.cantidad,
                subtotal: subtotalCalculado,
                comentarios: req.body.comentarios || "Sin observaciones",
              }
            },
            $set: { total: totalAcumulado + subtotalCalculado }
          }
        ).exec();
        res.json({
          mensaje: "Producto guardado en el carrito correctamente!",
          productoGuardado: update,
          idCarrito: req.body.identificador,
          total: totalAcumulado + subtotalCalculado
        });
      } else {
        res.json({
          mensaje:
            "No se encontró un producto valido para guardar en el carrito",
        });
      }
    } else {
      res.json({
        mensaje: "No se envió un producto valido para guardar en tu carrito",
      });
    }
  } else {
    //no existe el carrito, hay que generar uno y guardar el primer producto
    //vamos a calcular el subtotal
    //traemos el precio del producto
    const producto = await Producto.findOne({ id: req.body.idProducto });
    const subtotalCalculado = producto.precio * req.body.cantidad;
    let carritoNuevo = new Carrito({
      identificador: req.body.identificador,
      productos: [
        {
          idProducto: req.body.idProducto,
          cantidad: req.body.cantidad,
          subtotal: subtotalCalculado,
          comentarios: req.body.comentarios || "Sin observaciones",
        },
      ],
      total: subtotalCalculado

    });
    carritoNuevo.save();
    res.json({
      mensaje: "Producto guardado correctamente!",
      productoGuardado: producto,
      idCarrito: carritoNuevo.identificador,
      total: subtotalCalculado
    });
  }
});
//traer todos los carritos existentes
router.get("/", async (req, res) => {
  let result = await Carrito.find({});
  if (result != "") {
    res.json(result).status(200);
  } else {
    res.json({ mensaje: "No se han generado carritos aun" });
  }
});

//traer el carrito de un usuario con su identificador unico
router.get("/consultar/:identificador", async (req, res) => {
  let result = await Carrito.findOne({
    identificador: req.params.identificador,
  });
  if (result) {
    res.json(result).status(200);
  } else {
    res.json({ mensaje: "No se encontro un carrito asociado a tu ID" });
  }
});

//crear un carrito con el identificador unico
router.post("/crear", async (req, res) => {
  let data = req.body;
  if (!data.identificador) {
    res.json({ mensaje: "No se envió el identificador unico!" });
  }
  //validamos si ya existe ese carrito en la bd
  let existeCarrito = await Carrito.findOne({
    identificador: data.identificador,
  });
  if (existeCarrito != null) {
    res.json({
      mensaje: "El carrito ya existe en la base de datos",
    });
  } else {
    try {
      let nuevoCarrito = new Carrito({
        identificador: data.identificador,
        productos: [],
        total: 0,
      });
      nuevoCarrito.save().then(() =>
        res.json({
          mensaje: "Carrito guardado correctamente",
          carrito: nuevoCarrito,
        })
      );
    } catch (error) {
      res.json({
        mensaje: "Error al intentar guardar el carrito",
        error: error,
      });
    }
  }
});

//eliminar un carrito
router.delete("/:identificador", async (req, res) => {
  let result = await Carrito.findOneAndDelete({
    identificador: req.params.identificador,
  });
  if (result) {
    res.json({
      mensaje: "Carrito eliminado correctamente!",
      carritoEliminado: result,
    });
  } else {
    res.json({ mensaje: "No se encontro un Carrito con este ID" });
  }
});

//eliminar un producto del carrito
router.delete("/:identificador/:idProducto", async (req, res) => {
  let result = await Carrito.findOne({ identificador: req.params.identificador })
  if (result) {
    let producto = await Producto.findOne({ id: req.params.idProducto })
    if (producto) {
      //obtenemos el array de productos existentes en el carrito
      let arrayProductos = result.productos
      //filtramos el array sin el producto nuevo
      let arraySinProductoEliminado = arrayProductos.filter((producto) => {
        return producto.idProducto != req.params.idProducto
      })
      //obtenemos el total de los productos filtrado
      let nuevoTotal = arraySinProductoEliminado.reduce((acumulador, producto)=>{
        return acumulador + producto.subtotal
      }, 0)

      //una vez recuperado, hay que actualizar el carrito
      const actualizacion = await Carrito.findOneAndUpdate({ identificador: req.params.identificador }, {
        $set: {
          productos: arraySinProductoEliminado,
          total: nuevoTotal
        }
      })
        .then(() => {   
          res.json({ "mensaje": "Producto eliminado del carrito correctamente" }) })
        .catch((error) => {
          res.json({ "error": error })
        })
    } else {
      res.json({ "mensaje": "el producto que quieres eliminar no es valido" })
    }

  } else {
    res.json({ "mensaje": "El carrito que proporcionaste no existe" })
  }

})

module.exports = router;
