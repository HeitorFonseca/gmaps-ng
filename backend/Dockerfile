FROM node:8.11.2

ENV HOME=/home

COPY package.json package-lock.json  $HOME/hidrofit-api/

WORKDIR $HOME/hidrofit-api

RUN npm install

COPY . $HOME/hidrofit-api/

CMD ["npm", "start"]
