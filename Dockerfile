FROM node:14

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY ./eventBridge /app/eventBridge

COPY lambdaClients /app/lambdaClients

COPY ./consumer.js .

CMD ["node", "./consumer.js"]