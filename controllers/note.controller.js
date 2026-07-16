import pool from "../config/db.js";

export const getNotes = async (req, res) => {

    const userId = req.user.user_id;

    try {

        const notes = await pool.query(
            `
            SELECT *
            FROM notes
            WHERE user_id = $1
            ORDER BY created_date DESC;
            `,
            [userId]
        );

        return res.status(200).json(
            notes.rows
        );

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const createNote = async (req, res) => {

    try {

        const {
            title,
            content,
            category,
            tags
        } = req.body;

        const userId = req.user.user_id;

        if (!title || !content || !category) {

            return res.status(400).json({
                message: "Title, content and category are required."
            });

        }

        const newNote = await pool.query(

            `
            INSERT INTO notes (
                user_id,
                title,
                content,
                category,
                tags
            )

            VALUES ($1, $2, $3, $4, $5)

            RETURNING *;
            `,

            [
                userId,
                title,
                content,
                category,
                tags || null
            ]

        );

        return res.status(201).json({

            message: "Note created successfully.",

            note: newNote.rows[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};

export const updateNote = async (req, res) => {

    const noteId = req.params.id;

    const {
        title,
        content,
        category,
        tags
    } = req.body;

    const userId = req.user.user_id;

    if (!title || !content || !category) {

        return res.status(400).json({
            message: "Title, content and category are required."
        });

    }

    try {

        const updatedNote = await pool.query(

            `
            UPDATE notes

            SET
                title = $1,
                content = $2,
                category = $3,
                tags = $4

            WHERE note_id = $5
            AND user_id = $6

            RETURNING *;
            `,

            [
                title,
                content,
                category,
                tags || null,
                noteId,
                userId
            ]

        );

        if (updatedNote.rows.length === 0) {

            return res.status(404).json({
                message: "Note not found."
            });

        }

        return res.status(200).json({

            message: "Note updated successfully.",

            note: updatedNote.rows[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const deleteNote = async (req, res) => {

    const noteId = req.params.id;

    const userId = req.user.user_id;

    try {

        const deletedNote = await pool.query(

            `
            DELETE FROM notes

            WHERE note_id = $1
            AND user_id = $2

            RETURNING *;
            `,

            [
                noteId,
                userId
            ]

        );

        if (deletedNote.rows.length === 0) {

            return res.status(404).json({
                message: "Note not found."
            });

        }

        return res.status(200).json({
            message: "Note deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};