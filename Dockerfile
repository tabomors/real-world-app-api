FROM node:14

WORKDIR /usr/src/app

COPY . ./

RUN npm install

RUN npm run build

RUN chmod +x ./wait-for-it.sh

EXPOSE 3000

CMD [ "npm", "start" ]
