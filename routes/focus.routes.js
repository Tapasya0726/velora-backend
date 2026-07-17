import express from "express";

import {
    saveSession,
    getStats
} from "../controllers/focus.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/session", verifyToken, saveSession);

router.get("/stats", verifyToken, getStats);

export default router;