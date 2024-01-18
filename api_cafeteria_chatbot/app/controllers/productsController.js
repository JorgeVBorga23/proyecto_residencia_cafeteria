const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
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

//obtener todos los productos
router.get("/", async function (req, res) {
  let result = "";
  result = await Producto.find({});
  res.send(result);
});

//obtener un producto
router.get("/:id", async function (req, res) {
  let result = await Producto.findOne({ id: req.params.id });
  if (result) {
    res.json(result);
  } else {
    res.json({ mensaje: "No se encontro un producto con este ID" });
  }
});

//guardar un producto
router.post("/",  subirImagen.single("imagen"), async function (req, res) {
  let data = req.body;
  if (
    !data.id ||
    !data.nombre ||
    !data.categoria ||
    !data.precio ||
    !data.stock ||
    !data.descripcion 
  ) {
    console.log(req.body)
    res.json({ mensaje: "El producto tiene valores vacios" });
  }else{
//validamos si ya existe ese producto en la bd
let existeProducto = await Producto.findOne({ id: data.id });
if (existeProducto != null) {
  res.json({
    mensaje: "El producto ya existe en la base de datos",
    existe: 1,
  });
} else {
  //verificamos si existe la categoria
  let result = await Categoria.findOne({ id: data.categoria });
  if (result) {
    try {
      const validacion = validarImagen(req.file, "Y");
      if (!validacion.length) {
        try {
          let nuevoProducto = new Producto({
            id: data.id,
            nombre: req.body.nombre,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            stock: req.body.stock,
            imagen: "/uploads/" + req.file.filename,
          });
          nuevoProducto.save().then(() =>
            res.json({
              mensaje: "Producto guardado correctamente",
              producto: nuevoProducto,
              estado: 1,
            })
          );
        } catch (error) {
          res.json({
            mensaje: "Error al intentar guardar el Producto",
            error: error,
          });
        }
      } else {
        {
          res.json({ mensaje: validacion });
        }
      }
    } catch (error) {
      res.json({
        mensaje: "Error al intentar guardar el producto",
        error: error,
      });
    }
  } else {
    res.json({
      mensaje: "Debes clasificar tu producto con una categoria existente!",
    });
  }
}
  }
  
});

//borrar un producto
router.delete("/:id", async function (req, res) {
  try {
    let result = await Producto.findOneAndDelete({ id: req.params.id });
    if (result) {
      await eliminarImagen(req.params.id);
      res.json({
        mensaje: "Producto eliminado correctamente!",
        productoEliminado: result,
        estado: 1,
      });
    } else {
      res.json({ mensaje: "No se encontro un producto con este ID" });
    }
  } catch (error) {
    res.send(error);
  }
});

//actualizar un producto
router.put("/:id", async function (req, res) {
  try {
    let result = await Producto.findOne({ id: req.params.id });
    if (result) {
      let nuevaImagen = "";
      let datosActualizados = {
        id: req.params.id,
        name: req.body.name,
        categoria: req.body.categoria,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
      };
      try {
        if (req.file != null) {
          nuevaImagen = "/uploads/" + req.file.filename;
          datosActualizados = {
            id: req.params.id,
            name: req.body.name,
            categoria: req.body.categoria,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
            imagen: nuevaImagen,
          };
        }
        await eliminarImagen(req.params.id);
        let productoActualizado = await Producto.findOneAndUpdate(
          { id: req.params.id },
          datosActualizados
        ).then(() => {
          res.json({
            mensaje: "El producto se actualizó correctamente",
            nuevosDatos: productoActualizado,
          });
        });
      } catch (error) {
        res.json({ "Error de actualización": error });
      }
    } else {
      res.json({ mensaje: "No se encontro un producto con este ID" });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
