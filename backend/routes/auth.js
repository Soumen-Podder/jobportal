const express = require('express');
const router = express.Router();
const { db } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretdev';

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });

  const hashed = await bcrypt.hash(password, 10);
  const stmt = db.prepare(`INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`);
  stmt.run([name, email, hashed, role], function(err) {
    if (err) return res.status(400).json({ error: 'Email maybe exists' });
    const user = { id: this.lastID, name, email, role };
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ user, token });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET);
    res.json({ user: payload, token });
  });
});

module.exports = router;
