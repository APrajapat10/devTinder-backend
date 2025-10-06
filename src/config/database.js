const mongoose = require("mongoose");
const URI =
  "mongodb+srv://coolprajapat:rfJ8mkUcgR04wpfz@clustertest.ohumnrk.mongodb.net/devTinder";
async function dbConnect() {
  await mongoose.connect(URI);
}

module.exports = {
  dbConnect,
};
