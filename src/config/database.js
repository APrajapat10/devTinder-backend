const mongoose = require("mongoose");
const URI = process.env.DATABASE_CONNECTION_STRING;
async function dbConnect() {
  await mongoose.connect(URI);
}

module.exports = {
  dbConnect,
};
