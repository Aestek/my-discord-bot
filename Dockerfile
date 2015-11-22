FROM node:4.2.2-wheezy

RUN apt-get update && apt-get install -y tesseract-ocr

ADD . /bot
WORKDIR /bot

RUN npm install

CMD node src/index.js
