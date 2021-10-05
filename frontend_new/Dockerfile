FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3002
CMD ["http-server", "-p", "3002"]