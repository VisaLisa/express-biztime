const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const { route } = require("../app");

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
router.post("/", async (req, res, next) => {
  try {
    if (!req.body.code || !req.body.industry) {
      new ExpressError(`All data was not submitted, please retry`, 500);
    } else {
      const { code, industry } = req.body;
      const results = await db.query(
        `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *`,
        [code, industry]
      );
      return res.status(201).json({ industries: results.rows[0] });
    }
  } catch (e) {
    return next(e);
  }
});
//post route add industry to company
router.post("/:company", async (req, res, next) => {
  try {
    if (!req.body.code) {
      new ExpressError(`All data was not submitted, please retry`, 500);
    } else {
      const { company } = req.params;
      const { code } = req.body;
      const results = await db.query(
        `INSERT INTO company_industry (industry_code, company) VALUES ($1, $2) RETURNING *`,
        [code, company]
      );
      return res.status(201).json({ industries: results.rows[0] });
    }
  } catch (e) {
    return next(e);
  }
});

//put route industries
router.put("/:code", async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const result = await db.query(
      `INSERT INTO industries (code, industry)
      VALUES ($1, $2)
      RETURNING code, industry`,
      [code, industry]
    );
  } catch (e) {
    return next(e);
  }
});

//delete reoute delete industry
router.delete("/:code", async (req, res, next) => {
  try {
    const {} = req.params;
    const result = await db.query(
      `DELETE FROM industries
      WHERE code = $1
      RETURNING code`,
      [code]
    );
    if (result.rowCount === 0) {
      throw new ExpressError(`Industry Code: ${code} not found`, 404);
    }
    return res.send({ msg: `Deleted industry: ${code}` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
