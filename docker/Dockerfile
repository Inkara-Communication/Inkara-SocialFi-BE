FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY yarn.lock .
COPY package.json .

RUN yarn install
# If you are building your code for production
# RUN npm ci --omit=dev
COPY . .
RUN yarn build

EXPOSE 8080
EXPOSE 6379
CMD [ "yarn", "start" ]