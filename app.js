/** BizTime express application. */


const express = require("express");
const app = express();
const ExpressError = require("./expressError")

app.use(express.json());

// Routes
const companiesRoutes = require('./routes/companies');
const invoicesRoutes = require('./routes/invoices');
app.use('/companies', companiesRoutes);
app.use('/invoice', invoicesRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
