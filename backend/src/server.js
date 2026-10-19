require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");
console.log("JWT_SECRET loaded:", Boolean(process.env.JWT_SECRET));
console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
    try {
        if (
            !process.env.JWT_SECRET ||
            process.env.JWT_SECRET.length < 32
        ) {
            throw new Error(
                "JWT_SECRET must contain at least 32 characters."
            );
        }

        await pool.query("SELECT 1");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log("PostgreSQL connection successful.");
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();