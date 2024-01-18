const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserToken = require("../models/UserToken");
require('dotenv').config();


router.post("/login", async (req, res) => {
   try {
    const usuario = await UserToken.findOne({username: req.body.username, password: req.body.password})
    if(usuario){
        const token = jwt.sign({
            id: usuario._id,
            username: usuario.username
        }, process.env.JWT_SECRET)
        res.send({token})
    }else{
        res.json({mensaje: "Login no autorizado"})
    }
   } catch (error) {
    res.send("error")
   }
});

router.get("/yo", (req, res) => {
    try {
        
       
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
           return res.json({mensaje: "No has proporcionado el token"}) 
        }
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, usuario)=>{
            if(err){
                return res.status(403).json({ mensaje: 'Token inválido' });
            }
            console.log(usuario)
            res.send("ok")
        })
        
    } catch (error) {
        res.send(error)
    }
});

module.exports = router;
