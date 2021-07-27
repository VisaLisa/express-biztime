const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

//Get Route
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json({ companies: results.rows });
  } catch (e) {
    return next(e);
  }
});

// Get Route id
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query(
      "SELECT code, name, description FROM companies WHERE code=$1",
      [code]
    );
    const inv_Results = await db.query(
      "SELECT * FROM invoices WHERE comp_code=$1",
      [code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't find company with code of ${code}`, 404);
    }
    const company = results.rows[0];

    company.invoices = inv_Results.rows;

    return res.json({ company: company });
  } catch (e) {
    return next(e);
  }
});
// POST Route
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    //slugify to standardize name into lowercase & hypen code
    const code = slugify(name, { lower: true });

    //throw error if not complete field
    if (!code || !name || !description) {
      throw new ExpressError("Missing required field", 400);
    }

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
router.put("/:code", async (req, res, next) => {
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

// DELETE Route

router.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query(
      `DELETE FROM companies 
            WHERE code=$1 
            RETURNING code`,
      [code]
    );
    if (result.rowCount === 0) {
      throw new ExpressError(`Company Code: ${code} not found`, 404);
    }
    return res.send({ msg: `Deleted comapny: ${code}` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
