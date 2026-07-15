/*import express from "express";

import {
    getNotes, createNote, updateNote, deleteNote
} from "../controllers/note.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { verify } from "jsonwebtoken";

const router = express.Router();

router.get("/", verifyToken, getNotes);
router.post("/", verifyToken, createNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);

export default router;