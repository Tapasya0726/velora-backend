import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
    createSkill, getSkills, updateSkill,  deleteSkill, getSkillStats, getTopSkills
} from "../controllers/skills.controller.js";

const router = express.Router();

router.post("/", verifyToken, createSkill);
router.get("/", verifyToken, getSkills);
router.get("/top", verifyToken, getTopSkills);
router.put("/:id", verifyToken, updateSkill);
router.delete("/:id", verifyToken, deleteSkill);
router.get("/stats", verifyToken, getSkillStats);

export default router;