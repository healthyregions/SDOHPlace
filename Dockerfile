# Start with NodeJS 20 LTS
FROM node:20 AS build
WORKDIR /usr/app/

# Install dependencies
ARG YARN_TIMEOUT=600000
COPY package.json yarn.lock .
RUN yarn install --network-timeout ${YARN_TIMEOUT}

# Build app from source
COPY . .
RUN yarn build


# Copy built files to NGINX
FROM nginx:alpine AS runtime
RUN rm -rf /usr/share/nginx/html
COPY --from=build /usr/app/out /usr/share/nginx/html

