const express = require('express');
const router = express.Router();
const { db } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretdev';

function authAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// list pending jobs
router.get('/jobs/pending', authAdmin, (req, res) => {
  db.all(`SELECT j.*, u.name as posted_by_name FROM jobs j LEFT JOIN users u ON u.id=j.posted_by WHERE j.status='pending' ORDER BY j.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// approve job
router.post('/jobs/:id/approve', authAdmin, (req, res) => {
  const jobId = req.params.id;
  db.run(`UPDATE jobs SET status='approved' WHERE id=?`, [jobId], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    // send notifications to all students (simple: create notification rows)
    db.each(`SELECT id FROM users WHERE role='student'`, [], (err, row) => {
      if (!err && row) {
        db.run(`INSERT INTO notifications (user_id,message) VALUES (?,?)`, [row.id, `New job approved (ID ${jobId}). Check the jobs feed.`]);
      }
    }, () => {
      res.json({ message: 'Job approved and notifications queued' });
    });
  });
});

// reject job
router.post('/jobs/:id/reject', authAdmin, (req, res) => {
  const jobId = req.params.id;
  db.run(`UPDATE jobs SET status='rejected' WHERE id=?`, [jobId], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Job rejected' });
  });
});

module.exports = router;
