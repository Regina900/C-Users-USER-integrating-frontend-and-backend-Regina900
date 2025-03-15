import dotenv from 'dotenv';
import express from 'express';
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js"; // Add .js for ES modules
import mysql from 'mysql2';
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import db from './config/db.js'; // Your MySQL connection



const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MySQLStore
const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({}, db); // Passing db connection to the session store


db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database.");
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,  // Store sessions in MySQL

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes
app.use("/auth", authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
