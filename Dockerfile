# build frontend
FROM node:22.21.0 as build

COPY . /frontend
WORKDIR /frontend

RUN npm install
RUN npm run build
