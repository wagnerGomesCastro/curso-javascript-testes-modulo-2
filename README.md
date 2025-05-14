# watch-store

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

```

docker compose -f 'docker-compose.dev.yml' up -d --build 'vue-project'

**2 -** Executar os camandos docker para subir banco de bados no backend localmente,

```

1- $ docker compose -f docker-compose.dev.yml --env-file .env build --no-cache vue-project
2- $ docker compose -f docker-compose.dev.yml --env-file .env --compatibility up -d --remove-orphans vue-project
3- $ docker compose -f docker-compose.dev.yml --env-file .env --compatibility up --remove-orphans vue-project
4- $ docker compose -f docker-compose.dev.yml --env-file .env exec backend bash

```

```
