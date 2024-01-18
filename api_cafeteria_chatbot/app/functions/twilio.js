const accountSid = "";
const authToken = "";
const twilioNumber = "";

const twilio = require("twilio");
const Codigo = require("../models/CodigoSMS");
const client = new twilio(accountSid, authToken);

async function enviarMensaje(celular, token) {
  const codigo = Math.floor(10000 + Math.random() * 90000);

  // Guardar el código asociado al número de teléfono en la base de datos
  await Codigo.create({ numeroTelefono: celular, codigo, token });

  // Mensaje que se enviará
  const mensaje = `Tu código de verificación es: ${codigo}`;
  // Enviar el mensaje
  client.messages
    .create({
      body: mensaje,
      from: twilioNumber,
      to: "+52" + celular,
    })
    .then((message) => console.log(`Mensaje enviado con SID: ${message.sid}`))
    .catch((error) => console.error(error));
}
 
module.exports = {enviarMensaje}
