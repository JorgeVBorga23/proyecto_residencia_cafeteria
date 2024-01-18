const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Usuario = require("../models/Usuario");
const { generarIDUnica } = require("../functions/uniqueID");

router.get("/", async (req, res) => {
    let usuarios = await Usuario.find({});
    res.send(usuarios);
});

//obtener un usuario
router.get("/:id", async function (req, res) {
    let result = await Usuario.findOne({ id: req.params.id });
    if (result) {
        res.json(result);
    } else {
        res.json({ mensaje: "No se encontro un Usuario con este ID" });
    }
});

//crear un usuario
router.post("/", async function (req, res) {
    let data = req.body;
    if (!data.username || !data.password || !data.rol) {
        res.json({ mensaje: "El Usuario tiene valores vacios" });
    } else {
        //validamos si ya existe ese usuario en la bd
        let existeusuario = await Usuario.findOne({ id: data.id });
        if (existeusuario != null) {
            res.json({
                mensaje: "El Usuario ya existe en la base de datos",
            });
        } else {
            try {
                //traemos la fecha
                const fechaActual = new Date();
                const day = fechaActual.getDate().toString().padStart(2, "0"); // Obtiene el día y lo ajusta al formato dd
                const month = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // El mes es 0-indexed, por lo que sumamos 1, y luego lo ajustamos al formato mm
                const year = fechaActual.getFullYear().toString().slice(-2); // Obtiene los últimos dos dígitos del año para yy
                const formattedDate = `${day}-${month}-${year}`;
                //traemos la hora
                const horaActual = new Date();
                const hours = horaActual.getHours().toString().padStart(2, "0"); // Obtiene las horas y ajusta al formato hh
                const minutes = horaActual.getMinutes().toString().padStart(2, "0"); // Obtiene los minutos y ajusta al formato mm
                const seconds = horaActual.getSeconds().toString().padStart(2, "0"); // Obtiene los segundos y ajusta al formato ss

                const formattedTime = `${hours}-${minutes}-${seconds}`;

                //generamos un id Unico
                const identificador = generarIDUnica(
                    data.username,
                    formattedDate,
                    formattedTime
                );

                //creamos la contraeña hasheada
                const contraseniaSinHash = data.password;
                // Genera un salt (valor aleatorio) para hashear la contraseña
                const saltRounds = 10; // El número de rondas de hash (mayor es más seguro, pero también más lento)
                bcrypt.hash(contraseniaSinHash, saltRounds, (err, hash) => {
                    if (err) {
                        // Maneja el error, por ejemplo, enviando una respuesta de error al cliente
                        res.send("Ocurrio un error al hashear la contraseña");
                    } else {
                        const datos = {
                            id: identificador,
                            nombreUsuario: data.username,
                            password: hash,
                            rol: data.rol,
                        };
                        const nuevoUsuario = new Usuario(datos);
                        nuevoUsuario.save().then(() =>
                            res.json({
                                mensaje: "Usuario guardado correctamente",
                                usuario: nuevoUsuario,
                                contraseña: hash,
                            })
                        );
                    }
                });
            } catch (error) {
                res.json({
                    mensaje: "Error al intentar guardar el Usuario",
                    error: error,
                });
            }
        }
    }
});
//borrar un usuario
router.delete("/:id", async function (req, res) {
    let result = await Usuario.findOneAndDelete({ id: req.params.id });
    if (result) {
        res.json({
            mensaje: "Usuario eliminado correctamente!",
            usuarioEliminado: result,
        });
    } else {
        res.json({ mensaje: "No se encontro un Usuario con este ID" });
    }
});

//actualizar un usuario
router.put("/:id", async function (req, res) {
    let result = await Usuario.findOne({ id: req.params.id });
    if (result) {
        try {
            //creamos la contraeña hasheada
            const contraseniaSinHash = req.body.password;
            // Genera un salt (valor aleatorio) para hashear la contraseña
            const saltRounds = 10; // El número de rondas de hash (mayor es más seguro, pero también más lento)
            bcrypt.hash(contraseniaSinHash, saltRounds, async (err, hash) => {
                if (err) {
                    res.send(
                        "Ocurrio un error al hashear la contraseña en la actualizacion"
                    );
                } else {
                    let datosNuevos = {
                        nombreUsuario: req.body.usuario,
                        password: hash,
                        rol: req.body.rol,
                    };
                    let usuActualizado = await Usuario.findOneAndUpdate(
                        { id: req.params.id },
                        datosNuevos
                    );
                    res.json({
                        mensaje: "Usuario Actualizado correctamente",
                        anteriorUsuario: usuActualizado,
                        actualización: datosNuevos,
                    });
                }
            });
        } catch (error) {
            res.json({ "Error de actualización": error });
        }
    } else {
        res.json({ mensaje: "No se encontro un Usuario con este ID" });
    }
});

//login de usuario

router.post("/login", async (req, res) => {
    //traemos los datos que se envian por frontend
    const username = req.body.username;
    const password = req.body.password;

    //buscamos el usuario y contraseña en la base de datos

    const usuarioBD = await Usuario.findOne({
        nombreUsuario: username
    });
    if (usuarioBD) {
        // Compara la contraseña proporcionada con el hash almacenado en la base de datos

        bcrypt.compare(password, usuarioBD.password, (err, result) => {
            if (err) {
                // Maneja el error, por ejemplo, enviando una respuesta de error al cliente
                res.json({
                    mensaje:
                        "Ocurrio un error al intentar desencriptar la contraseña: " +
                        err.message,
                });
            } else if (result) {
                // La contraseña es correcta, procede con el inicio de sesión
                res.json({ success: "Inicio de sesion exitoso", nombre: usuarioBD.nombreUsuario, rol: usuarioBD.rol }).status(200);
            } else {
                // La contraseña es incorrecta, notifica al usuario
                res.json({ mensaje: "La contraseña no es correcta" }).status(401);
            }
        });
    } else {
        res
            .json({ mensaje: "No se encontro un usuario con estas credenciales" })
            .status(401);
    }
});

module.exports = router;
