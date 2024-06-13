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

# Install lint
RUN npm run lint

# Compile TypeScript to JavaScript
RUN npm run build

# Generate Prisma
RUN npx prisma generate

# Expose the port for the server
EXPOSE 3000

# Start the server
CMD ["node", "./dist/index.js"]

# Run the server
RUN npm run dev

# Run tests
RUN npm test