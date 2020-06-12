const mysql = require('mysql');
const config = require('../config.json');
const connection = mysql.createConnection(config.database);

connection.connect((err) => {
  if (err) {
    console.error(`Could not connect to database\n${err}`);
    process.exit();
  } else {
    console.log('Connected to database!');
  }
});
module.exports.connection = connection;

module.exports.query = (sql, callback = undefined) => {
  connection.query(sql, (err, result, fields) => {
    if (err) {
      console.error(err);
      process.exit();
    } else if (callback) {
      callback(result, fields);
    }
  });
};
