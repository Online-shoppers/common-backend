# E-commerce

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Seeding

```bash
# seed the database with roles
$ yarn mikro-orm seeder:run --class DatabaseSeeder
```

##Env example
PORT=3000
AT_SECRET=at_secret_key
RT_SECRET=rt_secret_key
AT_SECONDS_EXP=1800
RT_SECONDS_EXP=604800
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres

PGADMIN_DEFAULT_EMAIL=admin@gmaul.com
PGADMIN_DEFAULT_PASSWORD=postgres
PGADMIN_LISTEN_PORT=8080

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_DATABASE=postgres_test

## Setup

```bash
# create schema on db
$ yarn mikro-orm schema:create --fk-checks -r
```

and after that run migrations and seeders
