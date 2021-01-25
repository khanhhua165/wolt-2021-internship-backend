# wolt-2021-internship-backend

Rest API created with Nodejs using TypeScript and Express.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install this backend server.

```bash
npm install
```

Run the typescript command to generate javascript files.

```bash
npm run tsc
```

## Start Server

```bash
npm start
```

## Usage

After starting the server. We can fetch the data from http://localhost:3000/discovery with the neccessary param strings (lat and lon).

For example: http://localhost:3000/discover?lat=60.1709&lon=24.941 .

Other routes or wrong parameters will receive back a message with the coressponding error.
