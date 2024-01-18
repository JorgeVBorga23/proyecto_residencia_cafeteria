1. Clonar el proyecto

git clone https://github.com/JorgeVBorga23/proyecto_residencia_cafeteria

2. Acceder a la carpeta del proyecto

cd proyecto_residencia_cafeteria

3. Cambiar la variable de entorno del docker-compose.yml VITE_REACT_APP_API_URL por la url de tu servidor

4. cambiar la ruta del volumen del docker-compose a la ruta de tu eleccion de tu servidor

./aqui-va-tu-ruta:/data/db

5. Agregar tu json de token que se descarga desde Google Cloud para tu proyecto de dialogflow, agregarlo en la ruta /api_cafeteria_chatbot/token

6. Estando en la raiz del proyecto y con docker-compose/docker instalado ejecutar el siguiente comando

docker-compose build

7. Desplegar el software con el comando

docker-compose up

8. Acceder al sistema con la url:

http://url-de-tu-servidor:3002 