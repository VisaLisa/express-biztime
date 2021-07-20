const express = require("express");
const router = express.Router();
const ExpressError = require('../expressError');
const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json (results.rows)
    } catch (e) {
        next(e);
    }
})