FROM node:16.19-alpine As development
WORKDIR /app
COPY ./package.json ./yarn.lock ./

FROM node:16.19-alpine As builder
WORKDIR /work
COPY . /work/
RUN yarn install --no-progress
RUN yarn build

FROM node:16.19-alpine As runtime
WORKDIR /app
COPY ./package.json ./yarn.lock ./
COPY --from=builder /work/node_modules ./node_modules
COPY --from=builder /work/dist ./dist

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

USER node
EXPOSE 13000

CMD ["node", "dist/main"]
