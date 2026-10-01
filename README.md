# Gown Rental Tracker

## About the Application

The Gown Rental Tracker is a full-stack web application designed to manage boutique gown and dress rentals. The system allows users to perform full CRUD operations (Create, Read, Update, and Delete) on rental records across five core fields: Gown Name, Size, Customer Name, Rental Date, and Return Date. Built with a decoupled architecture, the React frontend interacts securely with a Node.js and Express backend REST API, which processes and persists all data into a local MySQL database.

---

## Database Selection Rationale (Why MySQL?)

MySQL was selected as the primary database for the Gown Rental Tracker due to its strong relational data modeling and ACID compliance, which ensure strict data integrity across inventory bookings and customer returns. Its structured schema with defined data types and ENUM constraints guarantees accurate tracking of gown sizes, rental schedules, and lifecycle statuses without the risk of inconsistent records. Furthermore, MySQL pairs efficiently with Node.js and Express through connection pooling with mysql2, delivering high query throughput and low latency for real-time dashboard updates. As a proven and scalable relational database system, it provides the reliability, indexing performance, and data security necessary for boutique management workflows.

---

## Installation and Setup Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- MySQL Server (running locally)

### 2. Backend Setup
1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create or configure your `.env` file inside the `backend` directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gown_rental_db
   DB_PORT=3306
   PORT=5000
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:5000` and automatically initialize the database schema and tables.

### 3. Frontend Setup
1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

## Available API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/rentals` | Retrieve all rental records with optional `search`, `size`, and `status` query filters |
| `GET` | `/api/rentals/stats` | Retrieve summary statistics (total, active, overdue, and returned rentals) |
| `GET` | `/api/rentals/:id` | Retrieve details for a single rental record by ID |
| `POST` | `/api/rentals` | Create a new rental record (requires gown name, size, customer, rental date, return date) |
| `PUT` | `/api/rentals/:id` | Update an existing rental record by ID |
| `DELETE` | `/api/rentals/:id` | Delete a rental record by ID |
| `GET` | `/api/health` | Check backend server and MySQL database connectivity status |
