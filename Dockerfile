FROM node:18 
# node:18 is overkill, use alpine and install yarn

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start:dev" ]
