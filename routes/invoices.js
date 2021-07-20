const express = require("express");
// const { route } = require("../../VideoCode/pg-intro/routes/users");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json (results.rows)
    } catch (e) {
        next(e);
    }
})