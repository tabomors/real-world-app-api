FROM node:14

WORKDIR /usr/src/app

COPY ./app ./

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
