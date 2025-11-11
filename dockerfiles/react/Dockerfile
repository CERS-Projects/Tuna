FROM node:22.19.0

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

RUN npm install -g nodemon

CMD ["sh", "-c", "nodemon --watch package.json --exec 'npm install' & npm run dev"]