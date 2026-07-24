import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool, types } = pg;

types.setTypeParser(1082, (value) => value);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000
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