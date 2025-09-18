const express = require('express');
const router = express.Router();
const { db } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretdev';

// auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// public: get approved jobs
router.get('/', (req, res) => {
  db.all(`SELECT j.*, u.name as posted_by_name FROM jobs j LEFT JOIN users u ON u.id=j.posted_by WHERE j.status='approved' ORDER BY j.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// get my posted jobs (auth)
router.get('/mine', auth, (req, res) => {
  db.all(`SELECT * FROM jobs WHERE posted_by=? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// create job (alumni only)
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'alumni' && req.user.role !== 'admin') return res.status(403).json({ error: 'Only alumni or admin can post' });
  const { title, company, description, apply_link } = req.body;
  const stmt = db.prepare(`INSERT INTO jobs (title,company,description,apply_link,posted_by,status) VALUES (?,?,?,?,?,?)`);
  // jobs by alumni go to pending; admin posts can auto-approve if desired
  const initialStatus = (req.user.role === 'admin') ? 'approved' : 'pending';
  stmt.run([title, company, description, apply_link, req.user.id, initialStatus], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    const jobId = this.lastID;
    res.json({ message: 'Job created', jobId, status: initialStatus });
  });
});

// for students: get notifications
router.get('/notifications', auth, (req, res) => {
  db.all(`SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;
