import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);

export default router;