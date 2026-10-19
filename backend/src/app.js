require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

const {
    notFoundHandler,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Test API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Customer Inquiry Management API is running!"
    });
});

// PostgreSQL connection test
const pool = require("./config/db");

app.get("/api/db-test", async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database"
        );

        res.status(200).json({
            success: true,
            message: "PostgreSQL connected successfully!",
            database: result.rows[0].database
        });
    } catch (error) {
        next(error);
    }
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Inquiry routes
app.use("/api/inquiries", inquiryRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;