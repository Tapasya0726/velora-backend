import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
    createEducation,
    getEducation,
    updateEducation,
    deleteEducation
} from "../controllers/education.controller.js";

const router = express.Router();

router.post("/", verifyToken, createEducation);

router.get("/", verifyToken, getEducation);

router.put("/:id", verifyToken, updateEducation);

router.delete("/:id", verifyToken, deleteEducation);

export default router;