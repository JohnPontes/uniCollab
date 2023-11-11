FROM node:18-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG ENV
RUN npm run build -- -c $ENV
# Stage 2: Run
FROM nginx:alpine3.17-slim
# Copy compiled files from previous build stage
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/unicollab /usr/share/nginx/html