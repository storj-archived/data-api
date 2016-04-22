FROM node:5
MAINTAINER Ian Patton <ian.patton@gmail.com>

RUN useradd -ms /bin/bash node
RUN mkdir -p /usr/src/app
RUN chown -R node /usr/src/app

USER node
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

EXPOSE 9000

CMD [ "npm", "start" ]
