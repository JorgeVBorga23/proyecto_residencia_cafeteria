const express = require("express");
const router = express.Router();
const Categoria = require("../models/Categoria");
const Producto = require("../models/Producto");
const { route } = require("./productsController");
const agregarNuevaCategoria = require("../chatbot/ChatbotController");
const { subirImagen } = require("./StorageController");
const { unlinkSync } = require("fs");

const validarImagen = (img, sevalida) => {
  var errors = [];
  if (sevalida === "Y" && img === undefined) {
    errors.push("Selecciona una imagen en formato JPG o PNG");
  } else {
    if (errors.length) {
      unlinkSync("./public/uploads/" + img.filename);
    }
  }
  return errors;
};
const eliminarImagen = async (id) => {
  const categoria = await Categoria.findOne({ id: id });
  const img = categoria.imagen;
  console.log(img);
  unlinkSync("./public" + img);
};

//obtener las categorias
router.get("/", async function (req, res) {
  try {
    let result = await Categoria.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});
//obtener una categoria
router.get("/:id", async function (req, res) {
  try {
    let result = await Categoria.findOne({ id: req.params.id });
    if (result) {
      res.json(result);
    } else {
      res.json({ mensaje: "No se encontro una Categoria con este ID" });
    }
  } catch (error) {
    res.send(error);
  }
});
//crear una categoria
router.post("/", subirImagen.single("imagen"), async function (req, res) {
  try {
    let data = req.body;
    if (!data.id || !data.nombre) {
      res.json({ mensaje: "La categoria tiene valores vacios" });
    } else {
      //validamos si ya existe esa categoria en la bd
      let existeCategoria = await Categoria.findOne({ id: data.id });
      if (existeCategoria != null) {
        res.json({
          mensaje: "La Categoria ya existe en la base de datos",
          existe: 1
        });
      } else {
        const validacion = validarImagen(req.file, "Y");
        if (!validacion.length) {
          try {
            let nuevaCategoria = new Categoria({
              id: req.body.id,
              nombre: req.body.nombre,
              imagen: "/uploads/" + req.file.filename,
            });
            nuevaCategoria.save().then(() =>
              res.json({
                mensaje: "Categoria guardada correctamente",
                categoria: nuevaCategoria,
                estado: 1
              })
            );
          } catch (error) {
            res.json({
              mensaje: "Error al intentar guardar la Categoria",
              error: error,
            });
          }
        } else {
          {
            res.json({ mensaje: validacion });
          }
        }
      }
    }
  } catch (error) {
    res.send(error);
  }
});

//borrar una categoria
router.delete("/:id", async function (req, res) {
  try {

  let result = await Categoria.findOneAndDelete({ id: req.params.id });
  console.log(result)
  if (result) {
    await eliminarImagen(req.params.id);
    res.json({
      mensaje: "Categoria eliminada correctamente!",
      categoriaEliminada: result,
      estado: 1
    });
  } else {
    res.json({ mensaje: "No se encontro una Categoria con este ID" });
  }
  } catch (error) {
    res.send(error)
  }
});

//actualizar una categoria
router.put("/:id", subirImagen.single("imagen"), async function (req, res) {
 try {
  let result = await Categoria.findOne({ id: req.params.id });
  if (result) {
    try {
      let nuevaImagen = "";
      let datosNuevos = { nombre: req.body.nombre };
      if (req.file != null) {
        nuevaImagen = "/uploads/" + req.file.filename;

        datosNuevos = {
          nombre: req.body.nombre,
          imagen: nuevaImagen,
        };
      }
      await eliminarImagen(req.params.id);
      let catActualizada = await Categoria.findOneAndUpdate(
        { id: req.params.id },
        { $set: datosNuevos }
      );

      res.json({
        mensaje: "Categoria Actualizada correctamente",
        categoriaAntigua: catActualizada,
        actualización: datosNuevos,
      });
    } catch (error) {
      res.json({ "Error de actualización": error });
    }
  } else {
    res.json({ mensaje: "No se encontro una categoria con este ID" });
  }
 } catch (error) {
  res.send(error)
 }
});

//traer los productos de una categoria
router.get("/lista-productos/:id", async (req, res) => {
  try {
    //verificamos si se envio un parametro
  if (req.params.id == undefined) {
    res.json({
      mensaje: "No se envio un parametro de busqueda",
    });
  } else {
    try {
      let listadoProductos = await Producto.find({ categoria: req.params.id });
      res.json(listadoProductos);
    } catch (error) {
      res.json({
        mensaje: "ocurrio un error",
        error: error,
      });
    }
  }
  } catch (error) {
    res.send(error)
  }
});

router.post("/chatbot", async (req, res) => {
  // Nuevo valor a agregar con sus sinónimos
  const nuevoValor = {
    value: "Hamburguesas",
    synonyms: ["Burger", "Cangreburger", "Hamburguesita"],
  };

  // Llama a la función para agregar el nuevo valor
  await agregarNuevaCategoria(nuevoValor, res);
});

module.exports = router;
