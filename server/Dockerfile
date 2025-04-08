FROM ghcr.io/puppeteer/puppeteer:23.2.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

COPY src/events.json ./dist

CMD [ "node", "./dist/index.js" ]