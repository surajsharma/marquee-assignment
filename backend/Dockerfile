FROM node:16.5.0
WORKDIR /backend
ADD . .
RUN npm install
RUN npm i -g nodemon
EXPOSE 3000
CMD ["npm", "start"]