## This bit just builds the project
FROM node:18 as build

WORKDIR /home/node/app

## Install
COPY package*.json ./
RUN npm i

## Move code over
COPY . .

## Build it
RUN npm run build

## A new stage, so the final image will only contain the compiled code and stuff. (Smaller = better)
FROM node:18-alpine as production

WORKDIR /home/node/app

## These are the only files actually required
COPY --from=build /home/node/app/dist ./dist
COPY --from=build /home/node/app/package.json ./package.json
COPY --from=build /home/node/app/node_modules ./node_modules

## Node needs to look in here
ENV NODE_PATH=./dist

## The tut i followed had this, dunno if we need it yet
ENV NODE_ENV=production

## Will run this when the image is run
CMD ["node", "dist/index.js"]