---
title: Run go Ethereum inside container with non-root user
date: Sat Jun 1 15:49:39 +07 2019
categories: Blockchain, Docker
tags: blockchain, docker
---

# Run go Ethereum inside a container with non-root user

I do serveral experiments on Ethereum blockchain it's really fun to play around. Sometime, you want to have a few decentralized features then you supposed to run your own node instead of [Infura](https://infura.io/) endpoint. This article is also a experiment to have fun with Ethereum and docker container.

## Docker compose

`docker-compose.yml` is quite familiar to start a docker project.

```yml
version: "3.7"
services:
  geth:
    image: my-geth:latest
    build:
      context: .
      dockerfile: Dockerfile
    user: "smart-ass"
    volumes:
      - ./data/:/home/smart-ass/data/:rw
```

In this configuration, I'm going to map my current directory `./data/` into `/home/smart-ass/data`, just want to make sure I won't lost my synchronization even I start a new container.

## Writing a script to start docker-compose

This script will create a user named `smart-ass` belong to `smart-ass` group and passed arguments from host to the container.

```sh
#!/usr/bin/env sh

PARENT_USER=smart-ass
PARENT_UID=1988
PARENT_GROUP=smart-ass
PARENT_GID=1988

# Creating smart ass user and group
getent group smart-ass 
if [ $? -eq 2 ]; then
    sudo groupadd -g 1988 smart-ass
    sudo useradd -M -g smart-ass -u 1988 smart-ass
fi

# Create folder if not existed
if [ ! -d "./data/" ]; then
  sudo mkdir ./data/
fi

# Changing owner ship of data folder
sudo chown ${PARENT_USER}:${PARENT_GROUP} -R ./data/
sudo chmod 755 -R ./data/

# Start docker build with argument
sudo docker-compose build \
    --build-arg PARENT_USER=${PARENT_USER} \
    --build-arg PARENT_UID=${PARENT_UID} \
    --build-arg PARENT_GROUP=${PARENT_GROUP} \
    --build-arg PARENT_GID=${PARENT_GID}
```

User's id and group's id were specified as a unique number `1988`. Let's take a look inside `Dockerfile`

## Dockerfile

[Alpine Linux](https://alpinelinux.org/) is good choice to begin with, `geth` is also supported by default that's make my job easier.

```dockerfile
FROM alpine:latest

# Consumed agurments from host machine
ARG PARENT_USER
ARG PARENT_UID
ARG PARENT_GROUP
ARG PARENT_GID

# Define home folder
ENV HOME=/home/${PARENT_USER}

# Install geth
# Add `smart-ass` group
# Add `smart-ass` user
# UID and GID is the same to host machine, we just want to make sure host's data is accessible to container's user
RUN apk add geth \
    && addgroup -g ${PARENT_GID} ${PARENT_GROUP} \
    && adduser -D -u ${PARENT_UID} -G ${PARENT_GROUP} -h ${HOME} ${PARENT_USER}

WORKDIR ${HOME}

COPY ./docker-script.sh ./docker-script.sh

RUN chown ${PARENT_USER}:${PARENT_USER} ./docker-script.sh \
    && chmod a+x ./docker-script.sh

USER ${PARENT_USER}

# Is required to discover ethereum nodes
EXPOSE 30303/tcp 30303/udp

CMD ["./docker-script.sh"]
```

The golden rule is, *"don't run with root privilege"*.

## Startup command

I want to run serveral commands during container boot up so I created `./docker-script.sh`:

```sh
#!/usr/bin/env sh

container_info=`id`
echo "Container info: ${container_info}"
echo "Test write to data folder:"
ls -la ${HOME}/data/
date > ${HOME}/data/test-write.txt
cat ${HOME}/data/test-write.txt
geth --datadir ${HOME}/data --rinkeby --syncmode "light"
```

### Rundocker without `docker-compose`

```
docker run -v $(pwd)/data/:/home/smart-ass/data -ti --rm my-geth:latest
```

## Conclusion

- The golden rule is, *"don't run with root privilege"*.
- Docker container was started with non-root user
- `./data/geth.ipc` was accessible from inside and outside of docker container.
- [IPCProvider](https://web3js.readthedocs.io/en/1.0/web3.html#providers) is providing impresive performance
- You could run with current user by changing these lines:

```sh
PARENT_USER=$(id -u)
PARENT_UID=$(id -nu ${PARENT_USER})
PARENT_GROUP=$(id -ng ${PARENT_USER})
PARENT_GID=$(id -g ${PARENT_USER})
```