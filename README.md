# harken-stock-node-server

<!-- [![Build Status] -->

> ### Harken Stock Node project to provide users the ability to create an account, authenticate and create stock watchlists. Implemented using Express HTTP, Mongoose and JWT. The quotes-publisher Node server microservice is used complement this project to stream stock quotes using socket.io. 

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm start run` to start the local server on port 9996

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) 
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [mongoose](https://github.com/Automattic/mongoose)
- [express-async-handler](https://www.npmjs.com/package/express-async-handler)
- [winston](https://www.npmjs.com/package/winston)

## Application Structure
- `src/`
    - `index.js`
    - `config/`
    - `controllers/`
    - `models/`
    - `repositories/`
    - `resources/`
    - `routes/`
    - `services/`
    - `utils/`

## Error Handling

In `routes/*.ts`, I have used 'express-async-handler' to provide error handling for asynchronous operations, which throws the error to express error handler.

## Authentication

In `src/services/auth.ts` HTTP requests are authenticated using the `Authorization` header with a valid JWT in the header.
