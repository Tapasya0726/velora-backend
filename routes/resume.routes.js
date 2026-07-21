import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
    getResume,
    saveResume
} from "../controllers/resume.controller.js";

const router = express.Router();

router.get("/", verifyToken, getResume);

router.post("/", verifyToken, saveResume);

export default router;