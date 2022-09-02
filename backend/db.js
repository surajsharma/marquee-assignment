require("dotenv").config();

//db
const { Client } = require("pg");

const baseClient = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    ssl: false,
    user: process.env.PGUSER,
    password: process.env.PGPASS
});

const dbClient = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    ssl: false,
    database: process.env.PGDB,
    user: process.env.PGUSER,
    password: process.env.PGPASS
});

module.exports = { baseClient, dbClient };
