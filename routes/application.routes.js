import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { addApplication , getApplications , updateApplication, deleteApplication, getApplicationStats } from "../controllers/application.controller.js";
// console.log("Application routes loaded");
const router = express.Router();

router.post("/", verifyToken, addApplication);
router.get("/", verifyToken, getApplications);
router.get("/stats", verifyToken, getApplicationStats);
router.put("/test", (req, res) => {
    res.json({
        message: "PUT route working"
    });
});
router.put("/:id", verifyToken, updateApplication);
router.delete("/:id", verifyToken, deleteApplication);

export default router;