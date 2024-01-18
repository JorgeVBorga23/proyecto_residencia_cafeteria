const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectarDB = require("./bd/conexion");
const app = express();
const productosRouter = require("./controllers/productsController");
const carritoRouter = require("./controllers/cartController");
const categoriaRouter = require("./controllers/categoryController");
const usuarioRouter = require("./controllers/userController");
const webhookRouter = require("./chatbot/WebhookController");
const pedidosRouter = require("./controllers/pedidoController")
const rateLimit = require('express-rate-limit');
const cookieParser = require("cookie-parser")
const authRouter = require("./controllers/authController")

require('dotenv').config();

//bd
connectarDB();

const corsOptions = {
  origin: 'http://recuerdosdeorizaba.ddns.net:3002', // Reemplaza con el dominio de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilitar el intercambio de cookies y credenciales
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};

//limitamos el numero de peticiones
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 50, // límite de solicitudes por IP,
  message: 'Has excedido el límite de peticiones. Por favor, inténtalo de nuevo más tarde.',

});

//midddlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"))
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/productos", productosRouter);
app.use("/carrito", carritoRouter);
app.use("/categoria", categoriaRouter);
app.use("/usuarios", usuarioRouter);
app.use("/webhook", webhookRouter);
app.use("/pedidos", pedidosRouter);
app.use("/auth", authRouter)
app.use((req, res)=>{
  res.status(404).json({"estado": "No se encontro este recurso"})
})
// Aplicar el límite de tasa a todas las solicitudes
app.use(limiter);


//config
app.set("puerto", process.env.PORT || 3001);

app.listen(app.get("puerto"), async () => {
  console.log("Listening on port", app.get("puerto"));
});
