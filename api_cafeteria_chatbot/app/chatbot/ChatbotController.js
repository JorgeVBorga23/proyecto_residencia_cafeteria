const obtenerToken = require("./autenticacion")
const axios = require("axios")

const projectId = 'residencia-396321';
const entityTypeId = '78d6822e-fac6-4586-b0e2-dadbdee9d8c5';

// Función para obtener la lista actual de valores de la entidad
async function obtenerListaActual() {
  const accessToken = await obtenerToken();
  try {
    const response = await axios.get(`https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/entityTypes/${entityTypeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data.entities;
  } catch (error) {
    console.error('Error al obtener la lista actual de valores:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Función para agregar un nuevo valor a la entidad
async function agregarNuevaCategoria(nuevoValor, res) {
  try {
    const accessToken = await obtenerToken();
    const listaActual = await obtenerListaActual();

    // Agrega el nuevo valor a la lista existente
    listaActual.push(nuevoValor);

    // Crea la entidad actualizada
    const updatedEntity = {
      displayName: 'Categoria',
      kind: 'KIND_MAP',
      entities: listaActual
    };

    // Realiza la solicitud de actualización
    const response = await axios.patch(`https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/entityTypes/${entityTypeId}`, updatedEntity, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Entidad actualizada con éxito:', response.data);
    
    // Responde al cliente con éxito
    res.status(200).json({ success: true, message: 'Entidad actualizada con éxito' });
  } catch (error) {
    console.error('Error al agregar un nuevo valor:', error.response ? error.response.data : error.message);

    // Responde al cliente con un error
    res.status(500).json({ success: false, error: 'Error al agregar un nuevo valor' });
  }
}

module.exports = agregarNuevaCategoria