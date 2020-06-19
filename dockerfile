FROM node:alpine

ARG BASE_DIR=/www/inventory

ADD ./server/dist ${BASE_DIR}/
ADD ./server/package.dist.json ${BASE_DIR}/package.json

WORKDIR ${BASE_DIR}/

RUN echo " --- Collecting node modules --- " \
 && npm install \
 && npm cache clean --force

VOLUME [${BASE_DIR}"/configs"]

EXPOSE 3000

CMD [ "node", "inventory" ]