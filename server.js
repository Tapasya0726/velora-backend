import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import noteRoutes from "./routes/note.routes.js";
import focusRoutes from "./routes/focus.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import skillRoutes from "./routes/skills.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import projectRoutes from "./routes/project.routes.js";
import educationRoutes from "./routes/education.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import { verifyToken } from "./middleware/auth.middleware.js";

const app = express();
app.use(cors());

app.use(express.json());

const logger = (req,res,next) => {
    // console.log(`${req.method} ${req.url}`);
    next();
}

app.use(logger);

app.use(authRoutes);
app.use("/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/focus", focusRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/applications", applicationRoutes);
app.use("/skills", skillRoutes);
app.use("/resume", resumeRoutes);
app.use("/resume/projects", projectRoutes);
app.use("/resume/education", educationRoutes);
app.use("/roadmap", roadmapRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Velora Backend!");
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