# pull the Node.js Docker image
FROM node:17.3.1

# create the directory inside the container
WORKDIR /usr/src/app

# copy the generated modules and all other files to the container
COPY . .

# run npm install in our local machine
RUN npm install && npm install -g pm2
# RUN npm install

EXPOSE 5555

# the command that starts our app
CMD [ "pm2-runtime", "start", "server.js", "-i", "1" ]
# CMD ["node", "server.js"]