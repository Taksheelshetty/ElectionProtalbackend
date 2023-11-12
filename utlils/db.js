const mysql = require("mysql");

const config = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});
config.connect((err) => {
  if (err) {
    console.error("Error connecting ", err);
    return;
  }
  console.log("Connected");
});
module.exports = config;
