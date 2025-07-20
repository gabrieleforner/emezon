# This Dockerfile builds the users microservice specific image with
# a differentiation between development and production builds.
#
# The difference between dev and prod modes is about how the app is executed,
# in development mode, the API server runs with ts-node-dev to ensure hot
# reloading (if using Tiltfile or similar).
#
# Instead, in prod build, the API server code is transpiled from TypeScript
# to JavaScript and then run it natively with Node.js

FROM node:24-alpine3.21

ARG prod=false
ENV PROD=$prod

WORKDIR /users_service

COPY package.json package-lock.json ./

RUN if [ "$PROD" = "true" ]; then \
      npm ci --only=production; \
    else \
      npm ci; \
    fi

COPY . .

CMD if [ "$PROD" = "true" ]; then npm run build && npm run serve; else npm run dev; fi
