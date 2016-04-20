FROM ubuntu:trusty
MAINTAINER Ian Patton <ian.patton@gmail.com>

RUN apt-get update && \
    apt-get install -yq \
      curl \
      wget \
      git-core \
      g++ \
      libssl-dev \
      libxml2-dev \
      apt-transport-https \
      lsb-release \
      build-essential \
      python-all

RUN git clone https://github.com/creationix/nvm.git /.nvm
RUN echo ". /.nvm/nvm.sh" >> /etc/bash.bashrc
RUN . /.nvm/nvm.sh && nvm install v5 && nvm use v5 && nvm alias default v5

# Bundle app source
COPY . /app
# Install app dependencies
RUN . /.nvm/nvm.sh && nvm use default && cd /app && npm install --production

EXPOSE 3000

CMD cd /app && . /.nvm/nvm.sh && nvm use default && node index
