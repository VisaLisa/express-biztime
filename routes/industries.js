const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

//get route
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM industries`);
    return res.json({ industries: results.rows });
  } catch (e) {
    return next(e);
  }
});

//post route new industry

//post route add industry to company

module.exports = router;
