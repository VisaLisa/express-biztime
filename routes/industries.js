const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const slugify = require("slugify");
const { route } = require("../app");

//get route
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM industries`);
    return res.json({ industry: results.rows });
  } catch (e) {
    return next(e);
  }
});

//post route new industry
router.post("/", async (req, res, next) => {
  try {
    const { industry } = req.body;
    //slugify to standize name into lowercase & hypencode
    const icode = slugify(industry, { lower: true, replacement: "_" });

    if (!icode || !industry) {
      throw new ExpressError("Missing required field", 500);
    }
    const results = await db.query(
      `INSERT INTO industries (icode, industry) 
        VALUES ($1, $2) 
        RETURNING icode, industry`,
      [code, industry]
    );
    return res.status(201).json({ industry: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

// //post route add industry to company
// router.post("/:company", async (req, res, next) => {
//   try {
//     if (!req.body.icode) {
//       new ExpressError(`Data not submitted`, 500);
//     } else {
//       const { company } = req.params;
//       const icode = slugify(industry, { lower: true, replacement: "_" });
//       const result = await db.query(
//         `INSERT INTO company_industry (industry_code, company) VALUES ($1, $2) RETURNING *`,
//         (icode, company)
//       );
//       return res.status(201).json({ industry: result.rows[0] });
//     }
//   } catch (e) {
//     return next(e);
//   }
// });

// //put route industries
// router.put("/:icode", async (req, res, next) => {
//   try {
//     const { icode, industry } = req.body;
//     const result = await db.query(
//       `INSERT INTO industries (icode, industry)
//       VALUES ($1, $2)
//       RETURNING icode, industry`,
//       [icode, industry]
//     );
//   } catch (e) {
//     return next(e);
//   }
// });

// //delete reoute delete industry
// router.delete("/:icode", async (req, res, next) => {
//   try {
//     const { icode } = req.params;
//     const result = await db.query(
//       `DELETE FROM industries
//       WHERE icode = $1
//       RETURNING icode`,
//       [icode]
//     );
//     if (result.rowCount === 0) {
//       throw new ExpressError(`Industry Code: ${code} not found`, 404);
//     }
//     return res.send({ msg: `Deleted industry: ${icode}` });
//   } catch (e) {
//     return next(e);
//   }
// });

module.exports = router;
