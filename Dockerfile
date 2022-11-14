FROM node:18-alpine as base

FROM base as dev
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8000
CMD ["sh", "-c", "NODE_ENV=development node dist/server.js"]

#requires pre built DIST folder.
FROM base as prod
# Run `docker build --no-cache .` to update dependencies
RUN apk add --no-cache git
WORKDIR /app
# COPY  --chown=node:node .env.production ./.env
COPY  --chown=node:node package.json .

#Make dirs where images are going to live

RUN mkdir -p ./processed
RUN mkdir -p ./uploads

#Leaves all dev dependencies behind
RUN npm install --omit=dev && npm prune --production
COPY  --chown=node:node ./dist ./dist
EXPOSE 8000
CMD ["sh", "-c", "NODE_ENV=production node dist/server.js"]