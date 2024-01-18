async function obtenerToken(){
  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth();
  
  const keyflie = require("../../token/token-dialogflow.json")
  // Configura el alcance necesario para Dialogflow
  const scope = 'https://www.googleapis.com/auth/cloud-platform';
  
  const client = await auth.fromJSON(keyflie);
  client.scopes = [scope];
  
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;
  return accessToken
  
}

module.exports = obtenerToken
