const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { corsOrigin } = require("./config/env");
const { connectDb } = require("./config/db");
const routes = require("./routes");
const { assignRequestId, logger } = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "100kb" }));
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    next(error);
  }
});
app.use(assignRequestId);
app.use(logger);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
