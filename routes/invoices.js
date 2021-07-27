const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

//get router
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json({ invoices: results.rows });
  } catch (e) {
    return next(new ExpressError("Table not found", 404));
  }
});

//get router id (returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}})
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      `SELECT i.id, 
            i.comp_code, 
            i.amt, i.paid, 
            i.add_date, 
            i.paid_date, 
            c.name, 
            c.description 
            FROM invoices AS i 
            INNER JOIN companies AS c ON i.comp_code = c.code 
            WHERE id=$1`,
      [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Invoice ID: ${id} not found`, 404);
    }
    const data = results.rows[0];
    const invoice = {
      id: data.id,
      company: {
        code: data.comp_code,
        name: data.name,
        description: data.description,
      },
      amt: data.amt,
      paid: data.paid,
      add_date: data.add_date,
      paid_date: data.paid_date,
    };
    return res.json({ invoice: invoice });
  } catch (e) {
    return next(e);
  }
});

//post router
router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    if (!comp_code || !amt) {
      throw new ExpressError("Missing required data", 400);
    }
    const results = await db.query(
      `INSERT INTO invoices (comp_code, amt) 
      VALUES ($1, $2) 
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});
//put router
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt, paid } = req.body;
    if (!amt) {
      throw new ExpressError("Missing required data", 404);
    }
    const currResults = await db.query(
      `SELECT paid FROM invoices WHERE id = $1`,
      [id]
    );
    if (currResults.rows.length === 0) {
      throw new ExpressError(`Invoice ID ${id} not found`, 404);
    }
    const currPaidDate = currResults.rows[0].paid_date;

    if (!currPaidDate && paid) {
      paidDate = new Date();
    } else if (!paid) {
      paidDate = null;
    } else {
      paidDate = currPaidDate;
    }

    const results = await db.query(
      `UPDATE invoices
           SET amt=$1, paid=$2, paid_date=$3
           WHERE id=$4
           RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, paidDate, id]
    );
    return res.send({ invoice: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});
//delete router
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      `DELETE FROM invoices WHERE id=$1 RETURNING id`,
      [id]
    );
    if (results.rowCount === 0) {
      throw new ExpressError(`Invoice ID: ${id} not found`, 404);
    }
    return res.send({ msg: `Deleted Invoice: ${id}` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

// TABLE
// CREATE TABLE invoices (
//     id serial PRIMARY KEY,
//     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
//     amt float NOT NULL,
//     paid boolean DEFAULT false NOT NULL,
//     add_date date DEFAULT CURRENT_DATE NOT NULL,
//     paid_date date,
//     CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
// );
