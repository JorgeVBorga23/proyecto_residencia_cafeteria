FROM node:18.18.1-alpine

RUN mkdir -p /usr/src/frontend

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN npm install 

COPY . .

CMD [ "npm" , "run", "dev" ]
