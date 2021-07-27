const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

//Get Route
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json(results.rows);
  } catch (e) {
    next(e);
  }
});

// Get Route id
router.get("/:code", async function (req, res, next) {
  try {
    const { code } = req.params;
    const companyQuery = await db.query(
      `SELECT code, name, description FROM companies WHERE code = $1`,
      [code]
    );
    if (companyQuery.rows.length === 0) {
      let notFoundError = new Error(
        `There is no company with code '${req.params.code}`
      );
      notFoundError.status = 404;
      throw notFoundError;
    }
    return res.json({ company: companyQuery.rows[0] });
  } catch (e) {
    return next(e);
  }
});
// POST Route
router.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const results = await db.query(
      `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) 
            RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

// PUT Route
// DELETE Route

module.exports = router;
