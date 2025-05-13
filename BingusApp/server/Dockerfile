## This bit just builds the project
FROM node:18 as build

WORKDIR /home/node/app

## Install
COPY package*.json ./
RUN npm i

## Move code over
COPY . .

## Will run this when the image is run
CMD ["node", "index.js"]