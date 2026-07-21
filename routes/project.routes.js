import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;