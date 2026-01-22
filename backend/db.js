const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database("./app.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database");
});


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS employee (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS review (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      title TEXT,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS assignment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id INTEGER,
      reviewer_id INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id INTEGER,
      reviewer_id INTEGER,
      rating INTEGER,
      comment TEXT
    )
  `);

  console.log("All tables are ready");
});

module.exports = db;
