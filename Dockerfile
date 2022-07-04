# the base image from which the app is built upon
FROM node:latest 
# Runs the mkdire command to create /usr/src/app inside docker container
RUN mkdir -p /app  
# Sets the work directory to /usr/src/app 
WORKDIR /app  
# Copies the contents of the current directory into the working directory inside the # docker container
COPY . /app
# Exposes port 8000 outside the docker container
EXPOSE 8000  
# Runs the npm install command to install dependencies
RUN npm install
RUN npm run build
# Provides the command required to run the application
CMD [ "npm", "start" ]