import express from "express";
import {getTasks, getGoals, createTask, updateTask, completeTask, deleteTask} from "../controllers/task.controller.js";
import {verifyToken} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getTasks);
router.get("/goals", verifyToken, getGoals);
router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.patch("/:id/complete", verifyToken, completeTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;