# Overview
This is a simple RESTful NestJS application created with the primary objective
of gaining familiarity with Node.js on the backend and practicing integration,
unit, and data access layer testing.

## Features
1. RESTful API: This project provides a RESTful API for communication with the
outside world to perform CRUD (Create, Read, Update, Delete) functionalities.
Leveraging TypeORM, it offers seamless integration with a database, allowing
for efficient storage and retrieval of data. Additionally, using custom SQL
queries to cater to specific use cases, providing flexibility and control
over data manipulation.
2. Explore how to write integration tests to ensure that different parts of
the application work together correctly.
3. Learn how to write unit tests to validate individual units of code in
isolation.
4. Practice testing the data access layer to verify custom sql queries

## Dependencies
1. Jest (in built)
2. class-validator class-transformer for validate DTOs before it gets to
controller classes.
3. TypeORM Mysql.
4. Testcontainers to spin up an instance of MySQL
5. TypeORM Test Transactions for a way to wrap tests in a transaction and
automatically roll back the commits when the test ends.
6. Nest Config to read environment variables.

## Pre-requisite
1. Node.js install
2. Docker installed

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e and data access layer tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Links
1. [TypeORM migrations](https://typeorm.io/migrations)
2. [Snake Naming Strategy](https://socket.dev/npm/package/typeorm-naming-strategy)
3. [tsconfig paths needed to run TypeORM migration](https://www.npmjs.com/package/tsconfig-paths)
4. [Transaction TypeORM](https://orkhan.gitbook.io/typeorm/docs/transactions)
5. [Custom Repository](https://github.com/typeorm/typeorm/issues/9013)

## Architecture
