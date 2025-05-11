# Dockerfile for Backend
FROM --platform=linux/amd64  node:20.18.0-alpine3.20

WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy the source code
COPY . .

# Expose port 4000
EXPOSE 4003

# Start the application
CMD ["npm", "start"]
