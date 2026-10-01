const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// READ: Get all rental records with optional search and filters
router.get('/', async (req, res) => {
  try {
    const { search, size, status, sortBy = 'rental_date', order = 'DESC' } = req.query;

    let query = 'SELECT * FROM rentals WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (gown_name LIKE ? OR customer LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (size && size !== 'ALL') {
      query += ' AND size = ?';
      params.push(size);
    }

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    // Validate sort column to avoid SQL injection
    const allowedSortFields = ['id', 'gown_name', 'size', 'customer', 'rental_date', 'return_date', 'status', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'rental_date';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const [rentals] = await pool.query(query, params);
    return res.status(200).json({ success: true, count: rentals.length, data: rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve rental records.' });
  }
});

// READ: Get summary statistics for dashboard metrics
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue,
        SUM(CASE WHEN status = 'Returned' THEN 1 ELSE 0 END) as returned
      FROM rentals
    `);

    const stats = rows[0] || { total: 0, active: 0, overdue: 0, returned: 0 };
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve statistics.' });
  }
});

// READ: Get single rental record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM rentals WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Rental record not found.' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching single rental:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve rental record.' });
  }
});

// CREATE: Add a new gown rental record
router.post('/', async (req, res) => {
  try {
    const { gown_name, size, customer, rental_date, return_date, status = 'Active' } = req.body;

    // Validation for the required 5 fields
    if (!gown_name || !size || !customer || !rental_date || !return_date) {
      return res.status(400).json({
        success: false,
        message: 'All 5 fields (gown name, size, customer, rental date, return date) are required.'
      });
    }

    const insertQuery = `
      INSERT INTO rentals (gown_name, size, customer, rental_date, return_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      gown_name.trim(),
      size,
      customer.trim(),
      rental_date,
      return_date,
      status
    ]);

    const [newRecord] = await pool.query('SELECT * FROM rentals WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Rental record created successfully.',
      data: newRecord[0]
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    return res.status(500).json({ success: false, message: 'Failed to create rental record.' });
  }
});

// UPDATE: Modify an existing gown rental record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { gown_name, size, customer, rental_date, return_date, status } = req.body;

    // Check if record exists
    const [existing] = await pool.query('SELECT * FROM rentals WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Rental record not found.' });
    }

    // Validation for required fields
    if (!gown_name || !size || !customer || !rental_date || !return_date) {
      return res.status(400).json({
        success: false,
        message: 'All 5 fields (gown name, size, customer, rental date, return date) are required.'
      });
    }

    const updateQuery = `
      UPDATE rentals 
      SET gown_name = ?, size = ?, customer = ?, rental_date = ?, return_date = ?, status = ?
      WHERE id = ?
    `;

    await pool.query(updateQuery, [
      gown_name.trim(),
      size,
      customer.trim(),
      rental_date,
      return_date,
      status || existing[0].status,
      id
    ]);

    const [updatedRecord] = await pool.query('SELECT * FROM rentals WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Rental record updated successfully.',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error updating rental:', error);
    return res.status(500).json({ success: false, message: 'Failed to update rental record.' });
  }
});

// DELETE: Remove a gown rental record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM rentals WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Rental record not found.' });
    }

    await pool.query('DELETE FROM rentals WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Rental record deleted successfully.',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting rental:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete rental record.' });
  }
});

module.exports = router;
