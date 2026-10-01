const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gown_rental_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Auto-initialize database schema and table structure if not present
async function initializeDatabase() {
  try {
    // Create temporary connection to ensure database exists
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 3306,
    });

    const dbName = process.env.DB_NAME || 'gown_rental_db';
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await rootConnection.end();

    // Create rentals table with required fields
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS rentals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gown_name VARCHAR(150) NOT NULL,
        size ENUM('XS', 'S', 'M', 'L', 'XL', 'Custom') NOT NULL DEFAULT 'M',
        customer VARCHAR(150) NOT NULL,
        rental_date DATE NOT NULL,
        return_date DATE NOT NULL,
        status ENUM('Active', 'Returned', 'Overdue') NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);

    // Populate initial sample seed records if table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM rentals');
    if (rows[0].count === 0) {
      const seedQuery = `
        INSERT INTO rentals (gown_name, size, customer, rental_date, return_date, status)
        VALUES 
          ('Emerald Velvet Gala', 'M', 'Sophia Hernandez', '2026-10-01', '2026-10-06', 'Active'),
          ('Blush Rose Ballgown', 'S', 'Elena Rostova', '2026-09-28', '2026-10-02', 'Active'),
          ('Midnight Blue Silk Dress', 'L', 'Chloe Montgomery', '2026-09-20', '2026-09-26', 'Overdue'),
          ('Champagne Sparkle Gown', 'XS', 'Mia Alcantara', '2026-09-15', '2026-09-22', 'Returned'),
          ('Ivory Lace A-Line', 'XL', 'Grace Kim', '2026-10-02', '2026-10-08', 'Active');
      `;
      await pool.query(seedQuery);
    }

    console.log(`Database and rentals table initialized successfully.`);
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
}

module.exports = {
  pool,
  initializeDatabase,
};
