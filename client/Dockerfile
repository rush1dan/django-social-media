FROM node:18-alpine

WORKDIR /client_app

COPY . /client_app

RUN npm install

# RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run"]