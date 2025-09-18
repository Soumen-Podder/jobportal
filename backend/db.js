const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbFile);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('student','alumni','admin')) NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      description TEXT,
      apply_link TEXT,
      posted_by INTEGER,
      status TEXT CHECK(status IN ('pending','approved','rejected')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(posted_by) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // ensure there is an admin account (default password: adminpass)
    db.get(`SELECT * FROM users WHERE role='admin' LIMIT 1`, (err, row) => {
      if (err) console.error(err);
      if (!row) {
        const bcrypt = require('bcrypt');
        bcrypt.hash('adminpass', 10).then(hash => {
          db.run(`INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`,
            ['Admin', 'admin@college.edu', hash, 'admin']);
          console.log('Created default admin: admin@college.edu / adminpass');
        });
      }
    });
  });
}

module.exports = { db, init };
