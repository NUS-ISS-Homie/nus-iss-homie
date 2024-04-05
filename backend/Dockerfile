FROM node:20-alpine

ARG DB_CLOUD_URI

# Env variables
ENV ENV PROD
ENV PORT 8000
ENV SALT_ROUNDS 10
ENV DB_CLOUD_URI ${DB_CLOUD_URI}

# Install node packages
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./
USER node
RUN npm ci

# Copy application code
COPY --chown=node:node . .
EXPOSE 8000
CMD ["node", "index.js"]
