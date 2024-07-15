FROM ubi8/nodejs-18 AS frp

# Copy over the source
ADD . $HOME
RUN npm install && \
    npm run build

# Expose the endpoint
EXPOSE 3000

# Run the production build
CMD npm run start:prod
