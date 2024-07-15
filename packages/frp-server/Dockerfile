FROM node:18-alpine AS frp

# Copy over the source
WORKDIR /usr/src/frp
COPY . .
RUN apk update && \
    npm install && \
    npm run build

# Expose the endpoint
EXPOSE 3000

# Run the production build
CMD npm run start:prod
