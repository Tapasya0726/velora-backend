import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import noteRoutes from "./routes/note.routes.js";
import { verifyToken } from "./middleware/auth.middleware.js";

const app = express();
app.use(cors());

app.use(express.json());

const logger = (req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

app.use(logger);

app.use(authRoutes);
app.use("/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Velora Backend!");
});

app.get("/dashboard", (req, res) => {
    res.send("Dashboard Data");
});

app.get("/focus", (req,res) => {
    res.send("Focus Data");
});

app.get("/applications", (req,res) => {
    res.send("All Applications");
});

app.get("/resume", (req,res) => {
    res.send("Resume Data");
});

app.get("/roadmap", (req,res) => {
    res.send("Roadmap Data");
});

app.get("/analytics", (req,res) => {
    res.send("Analytics Data");
});

app.get("/settings", (req,res) => {
    res.send("Settings Data");
});

app.get("/users", async (req,res) => {

    try{
        const result = await pool.query("SELECT * FROM users");
        res.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message:"Database Error"
        });
    }

});

app.get("/test", verifyToken, (req, res) => {
    res.json({
        message: "Protected Route Working"
    });
});

app.listen(5000, () => {
    console.log("Velora backend server is running...");
});

app.use((req, res) => {

    res.status(404).json({
        message: "Route Not Found"
    });

});