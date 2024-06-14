# Author: Alan Zhang

# Use official Node.js image as base
FROM node:20

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Copy environment variables
COPY .env.docker .env

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port for the server
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
