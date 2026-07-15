import express from "express";

import {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get(
    "/profile",
    verifyToken,
    getProfile
);
router.put(
    "/profile",
    verifyToken,
    updateProfile
);
router.put(
    "/change-password",
    verifyToken,
    changePassword
);

export default router;