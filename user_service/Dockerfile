FROM node:22-alpine
WORKDIR /user-service

COPY package*.json .
RUN npm install
COPY tsconfig.json .
COPY nodemon.json .
COPY . .
RUN npm run serve