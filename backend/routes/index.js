let express = require("express");
let router = express.Router();
const { dbClient } = require("../db");

//get all companies
router.get("/", async function (req, res, next) {
    let companies = await dbClient.query(`SELECT * from companies`);
    res.status(200).send({ companies: companies.rows });
});

//create a company
router.post("/", async function (req, res, next) {
    console.log("got post request", req.body.name, req.body.cin);
    let new_company = await dbClient.query(
        `INSERT into companies (NAME, CIN) VALUES ($1, $2)`,
        [req.body.name, req.body.cin]
    );

    if (new_company.rowCount) {
        res.status(201).send({
            status: "company created",
            name: req.body.name,
            cin: req.body.cin
        });
    }
});

module.exports = router;
