# Gown Rental Tracker

A full-stack web application designed for boutique gown rental management. Built with React (Frontend), Node.js and Express (Backend), and MySQL (Database).

---

## Features

- **Create**: Add new gown rental records with gown name, size, customer name, rental date, and return date.
- **Read**: View all rental records in an interactive dashboard with real-time search, size filtering, status filtering, and overview statistics.
- **Update**: Edit existing gown rental details and update statuses (Active, Returned, Overdue).
- **Delete**: Remove rental records with confirmation dialogs.
- **Architecture**: Decoupled client-server model where React interacts solely through Express REST API endpoints, keeping database credentials securely isolated in `.env`.

---

## Tech Stack

- **Frontend**: React (Vite), Modern Vanilla CSS, Lucide Icons
- **Backend**: Node.js, Express, CORS, Dotenv
- **Database**: MySQL (Connection pooling via `mysql2/promise`)

---

## Project Structure

```
MidtermExam/
├── backend/
│   ├── .env.example
│   ├── db.js
│   ├── server.js
│   ├── routes/
│   │   └── rentals.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── RentalTable.jsx
│   │   │   ├── RentalModal.jsx
│   │   │   ├── DeleteModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Database Setup
Ensure MySQL is running on your system, then create the database or let the backend auto-create it:
```sql
CREATE DATABASE IF NOT EXISTS gown_rental_db;
```

### 2. Backend Setup
1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and configure your MySQL credentials:
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
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/rentals` | Retrieve all rental records (supports `search`, `size`, `status` query params) |
| `GET` | `/api/rentals/stats` | Retrieve summary counts (total, active, overdue, returned) |
| `GET` | `/api/rentals/:id` | Retrieve single rental record by ID |
| `POST` | `/api/rentals` | Create a new rental record |
| `PUT` | `/api/rentals/:id` | Update an existing rental record |
| `DELETE` | `/api/rentals/:id` | Delete a rental record |
| `GET` | `/api/health` | Backend and database connectivity status |
