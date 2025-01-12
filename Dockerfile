# Use the official Node.js image as the base image
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json or yarn.lock
COPY package*.json ./
# If you are using Yarn, uncomment the line below and comment the npm install line
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# If you are using Yarn, uncomment the line below and comment the npm install line
# RUN yarn install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Build the application
RUN npm run build
# If you are using Yarn, uncomment the line below and comment the npm run build line
# RUN yarn build

# Use a smaller image for the production environment
FROM node:18 AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env .env

# Set environment variables if necessary
# ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/apps/api/main"]