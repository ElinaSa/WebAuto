# Define the base image for application to be Debian 13 LTS and Node.js
FROM node:lts-trixie-slim

# Create directory for the app even if parent directory /opt does not exist (-p)
RUN mkdir -p /opt/kobwentti

# Give base image's builtin user and group node permissions to /opt/app directory and subdirectories (-R)
RUN chown -R node:node /opt/kobwentti

# Make it the working directory
WORKDIR /opt/kobwentti

# Copy installation instructions for dependencies package.json and package-lock.json to working directory
COPY package*.json ./

# Switch user to node who is not a root level user
USER node

# Install dependencies as an ordinary user (node)
RUN npm install

# Copy all the source code to working directory and give node user and group permissions to files
COPY --chown=node:node . .

# Expose the port to be used
EXPOSE 8080

# Start the app
CMD [ "node", "app.js" ]