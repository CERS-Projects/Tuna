FROM node:22.19.0

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

CMD ["npm", "run", "dev"]