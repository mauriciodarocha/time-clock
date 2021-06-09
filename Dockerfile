# docker image
FROM node:16-alpine

# working folder
WORKDIR /usr/app/time-clock

# copy of essential files
COPY package.json package-lock.json ./

# npm install
RUN npm install --silent

# path to node modules
ENV PATH="./node_modules/.bin:$PATH"