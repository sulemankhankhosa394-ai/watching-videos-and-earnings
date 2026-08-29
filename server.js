const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

const express = require('express');
const cors = require('cors');

require('./db'); // initializes DB + default admin on first run

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const walletRoutes = require('./routes/wallet');
const withdrawRoutes = require('./routes/withdraw');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/admin', adminRoutes);

// Serve the frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Watch & Earn server running on http://localhost:${PORT}`);
});
