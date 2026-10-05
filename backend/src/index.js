// Vercel imports this Express app as a serverless function. Database readiness
// is handled by the connection middleware in app.js before each API request.
module.exports = require("./app");
