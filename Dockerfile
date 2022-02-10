FROM alpine:latest as deps
RUN apk add nodejs yarn
WORKDIR /app
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/
RUN --mount=type=cache,target=/usr/local/share/.cache yarn --frozen-lockfile

FROM alpine:latest as package-server
RUN apk add nodejs yarn
WORKDIR /app
COPY --from=deps /app .
COPY packages/server ./packages/server
RUN yarn build:server

FROM alpine:latest as package-web
RUN apk add nodejs yarn
WORKDIR /app
COPY --from=deps /app .
COPY packages/web ./packages/web
RUN yarn build:web

FROM alpine:latest
RUN apk add nodejs yarn
WORKDIR /app
COPY package.json ./
COPY packages/server/package.json ./packages/server/package.json
COPY packages/web/package.json ./packages/web/package.json
COPY --from=package-server /app/packages/server/dist ./packages/server/dist
COPY --from=package-web /app/packages/web/dist ./packages/web/dist
RUN yarn --frozen-lockfile --prod
ENV NODE_ENV=production
HEALTHCHECK CMD curl localhost:3000
CMD [ "yarn", "start" ]