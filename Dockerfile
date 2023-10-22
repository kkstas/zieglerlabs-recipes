# DEVELOPMENT STAGE
FROM node:20-alpine As development
WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

USER node

# BUILD STAGE
FROM node:20-alpine As build
WORKDIR /app

COPY --chown=node:node package*.json ./

# Copying node_modules from previous image to have access to previously installed nest CLI
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
ENV NODE_ENV=production

# Deleting node_modules and reinstalling them (this time without devDependencies)
RUN npm ci --only=production && npm cache clean --force
USER node

# PRODUCTION STAGE
FROM node:20-alpine As production

# Copying code from BUILD stage
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/mock-data.json ./
COPY --chown=node:node --from=build /app/dist ./dist


CMD ["node", "dist/main.js"]
