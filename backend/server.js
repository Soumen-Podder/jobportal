require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

init();

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.send('College Jobs API running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
