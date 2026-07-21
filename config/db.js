import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool, types } = pg;

types.setTypeParser(1082, (value) => value);

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

pool.connect()
    .then(() => {
        console.log("✅ Database Connected Successfully");
    })
    .catch((error) => {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
    });

export default pool;