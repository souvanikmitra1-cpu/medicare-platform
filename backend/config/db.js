const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "medicine_delivery",
  // SSL will be enabled automatically when connecting to Azure Database for PostgreSQL
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database successfully.");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

module.exports = pool;
