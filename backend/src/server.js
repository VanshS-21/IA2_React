const app = require('./app');
const { connectDb } = require('./config/db');
const { port } = require('./config/env');

async function start() {
  await connectDb();
  app.listen(port, () => console.log(`ShelfLife API listening on port ${port}`));
}

start().catch((error) => {
  console.error('Unable to start ShelfLife:', error.message);
  process.exit(1);
});
