require("dotenv").config();

//db
const { Client } = require("pg");

const baseClient = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    ssl: false
});

const dbClient = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    ssl: false,
    database: process.env.PGDB
});

module.exports = { dbClient, baseClient };

// module.exports = { connect: dbConnect, db: client };
