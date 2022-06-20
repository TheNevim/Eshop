FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run-script build
EXPOSE 8081
CMD [ "node", "server.js"]
