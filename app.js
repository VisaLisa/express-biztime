/** BizTime express application. */

const express = require("express");

const app = express();
const ExpressError = require("./expressError");
const cRoutes = require("./routes/companies");
const invoiceRoutes = require("./routes/invoices");
const industryRoute = require("./routes/industries");

app.use(express.json());

//** Routes *//
app.use("/companies", cRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/industries", industryRoute);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message,
  });
});

module.exports = app;

app.listen(3000, function () {
  console.log("Server started on 3000");
});
