const multer = require("multer")


const guardar = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb)=>{
        if(file != null){
            const extension = file.originalname.split(".").pop()
            cb(null, Date.now()+ "." + extension)
        }
    }
})

const filtro = (req, file, cb) =>{
    if(file && (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") ){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const subirImagen = multer({storage: guardar, fileFilter: filtro})
module.exports = { subirImagen }