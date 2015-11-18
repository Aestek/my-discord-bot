FROM node:4.2.2-wheezy

ADD . /bot
WORKDIR /bot

RUN npm install

CMD node src/index.js
