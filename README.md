# Rating App — Full Stack Store Rating System

## Overview
This is a full-stack store rating application built for a placement assignment.  
Roles supported: **System Administrator**, **Normal User**, **Store Owner**.

## Tech Stack
- Backend: Express.js, MongoDB (Mongoose), JWT Auth
- Frontend: React.js, Tailwind CSS, Axios, React Router

## Quick Start (local)

### 1) Backend
1. Open terminal:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create `.env` (copy from `.env.example`) and set:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rating_app_db
JWT_SECRET=mysecret123
```
4. Seed database (optional):
```bash
node seed.js
```
5. Start backend:
```bash
npm start
```
Backend will run on `http://localhost:5000`.

### 2) Frontend
1. Open new terminal:
```bash
cd frontend
npm install
npm run dev
```
2. Open browser at the address shown (default `http://localhost:8080` or `http://localhost:3000`).

## Default Test Accounts (seeded)
- Admin: admin@gmail.com / Admin@1234
- Owner: owner@gmail.com / Owner@1234
- User: user@gmail.com / User@1234

## API notes
- Frontend is configured to use `http://localhost:5000/api` as base URL.
- Key endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/admin/dashboard` (admin)
  - `GET /api/user/stores` (authenticated users)
  - `POST /api/user/ratings` (authenticated users)

## Validation rules
- Name: 20–60 characters
- Address: max 400 characters
- Password: 8–16 chars, at least one uppercase and one special character
- Email: must be valid

## Notes
- Remove `node_modules` folders before pushing to GitHub (this repo already ignores them).
- If MongoDB is remote, update `MONGO_URI` accordingly.


## Note about database choice

The original challenge suggested using **MySQL** or **PostgreSQL**.  
For this submission I used **MongoDB (Atlas)** to accelerate development and focus on delivering complete functionality (authentication, role-based access, seeding, dashboards, and rating logic).

### Why MongoDB
- Rapid prototyping and simpler JSON-style documents.
- Easy cloud seeding and testing with MongoDB Atlas.
- Full feature set implemented with MERN stack efficiency.

### How to port to MySQL/PostgreSQL
The MongoDB collections map directly to relational tables.

| Mongo Collection | SQL Table | Notes |
|------------------|----------|------|
| `users`          | `users`  | id (PK), name, email (unique), password, address, role |
| `stores`         | `stores` | id (PK), name, email, address, owner_id (FK -> users.id) |
| `ratings`        | `ratings`| id (PK), rating (1-5), user_id (FK -> users.id), store_id (FK -> stores.id), created_at |

#### Example SQL
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role VARCHAR(10) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  address VARCHAR(400),
  owner_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  user_id INTEGER NOT NULL REFERENCES users(id),
  store_id INTEGER NOT NULL REFERENCES stores(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);