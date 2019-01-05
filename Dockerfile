FROM mhart/alpine-node:10 as builder
# We store all our files in /usr/src to perform the build
WORKDIR /usr/src
# We first add only the files required for installing deps
# If package.json or yarn.lock don't change, no need to re-install later
COPY package.json ./
# We install our deps
RUN npm i
# We copy all source files
COPY . .
# We run the build and expose as /public
RUN npm run build

FROM mhart/alpine-node:10 as runtime
WORKDIR /usr/src
COPY --from=builder /usr/src/public ./
RUN npm i --no-save serve
CMD ./node_modules/.bin/serve -s -l tcp://0.0.0.0:80 ./public
# needs to serve public folder, not root