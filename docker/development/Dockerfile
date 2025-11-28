# base Image from official Node.js
FROM node:24

# set the working dir inside the container. This can now be referred as '.' in this file
WORKDIR /usr/src/app

# copy all src package files to container wrk dir, these will also be cached inside container. 
# Left is src proj and right is in the container.
COPY package*.json ./

# install the app dependencies given in package.
RUN npm install

# Expose that container port from where the application can be invoked. This is the port the app will run on. 
# Stating here doesn't actually expose! its just for documentation. 
EXPOSE 5501

# Copy all the app's files(whole) into the container wrk dir.
COPY . .

# provide cmd to run this application
CMD ["npm", "run", "dev"]