FROM node:22.12

ENV ENV=prod
ENV PORT=3000
WORKDIR /app

# Setup
COPY package.json .
RUN npm install --legacy-peer-deps

# Build
# RUN npm run build

COPY . .
EXPOSE 3000

# Run
CMD ["npm", "start"]