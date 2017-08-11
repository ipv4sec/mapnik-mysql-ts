FROM node:6

WORKDIR /usr/local/
RUN mkdir mapnik-mysql-ts
ADD . mapnik-mysql-ts/

WORKDIR /usr/local/mapnik-mysql-ts
RUN npm install --registry https://registry.npm.taobao.org
RUN gulp build

EXPOSE 3000

CMD ["sh", "npm start"]