var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.json({ info: "Node.js, Express, and Postgres API" });
});

module.exports = router;
