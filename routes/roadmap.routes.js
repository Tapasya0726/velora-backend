import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { selectRoadmap, getRoadmap,  updateRoadmapStatus
 } from "../controllers/roadmap.controller.js";

const router = express.Router();

router.post("/select", verifyToken, selectRoadmap);
router.get("/", verifyToken, getRoadmap);
router.put("/:roadmapItemId", verifyToken, updateRoadmapStatus);

export default router;