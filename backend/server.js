const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase, pool } = require('./db');
const rentalRoutes = require('./routes/rentals');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing for React frontend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Mount rentals REST API endpoints
app.use('/api/rentals', rentalRoutes);

// Health check endpoint for system monitoring
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({
      status: 'online',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'online',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Fallback 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found.' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Start Express server and initialize database tables
app.listen(PORT, async () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  await initializeDatabase();
});
