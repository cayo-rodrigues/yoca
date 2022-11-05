FROM node:16-alpine

RUN apk update

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "dev"]
