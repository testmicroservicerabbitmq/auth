FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install && npm cache clean --force

RUN apt-get install httping

COPY . .

CMD ["npm", "run", "dev"]