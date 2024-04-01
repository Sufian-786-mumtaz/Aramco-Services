# Development Image 
FROM node:21-alpine3.18 AS development

WORKDIR /usr/app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 4802

CMD [ "yarn", "start:dev" ]

# Production Image 
FROM node:21-alpine3.18 AS production

WORKDIR /usr/app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4802

CMD [ "yarn", "start:prod" ]