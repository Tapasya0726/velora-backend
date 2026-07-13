import express from "express";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

const logger = (req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

app.use(logger);

app.use(authRoutes);

app.post("/tasks", (req,res) => {
    if (!req.body.title){
        return res.status(400).json({
            message:"title is required"
        });
    }
    res.status(201).json({
        message:"task created successfully"
    })
});

app.put("/tasks/:id", (req,res) => {
    console.log(req.params.id);
    res.send("Task Updated");
});

app.delete("/tasks/:id", (req,res) => {
    console.log(req.params.id);
    res.status(204).send();
});

app.get("/", (req, res) => {
    res.send("Welcome to Velora Backend!");
});

app.get("/dashboard", (req, res) => {
    res.send("Dashboard Data");
});

app.get("/tasks", (req, res) => {
    res.status(200).json([
        {id: 1,
            title: "Complete Backend",
            priority: "High"
        },
        {
            id: 2,
            title: "Go to Gym",
            priority: "Medium"
        }
    ]);
});

app.get("/notes", (req,res) => {
    res.send("All Notes");
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

app.listen(5000, () => {
    console.log("Velora backend server is running...");
});

app.use((req, res) => {

    res.status(404).json({
        message: "Route Not Found"
    });

});