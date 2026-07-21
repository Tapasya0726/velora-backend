import pool from "../config/db.js";

export const createResume = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            summary,
            github,
            linkedin,
            portfolio,
            experience,
            certifications,
            achievements
        } = req.body;

        const existingResume = await pool.query(
            `
            SELECT *
            FROM resume
            WHERE user_id = $1;
            `,
            [userId]
        );

        if (existingResume.rows.length > 0) {

            return res.status(400).json({
                message: "Resume already exists."
            });

        }

        const result = await pool.query(
            `
            INSERT INTO resume
            (
                user_id,
                summary,
                github,
                linkedin,
                portfolio,
                experience,
                certifications,
                achievements
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8
            )
            RETURNING *;
            `,
            [
                userId,
                summary,
                github,
                linkedin,
                portfolio,
                experience,
                certifications,
                achievements
            ]
        );

        return res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const getResume = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT *
            FROM resume
            WHERE user_id = $1;
            `,
            [userId]
        );

        if (result.rows.length === 0) {

    return res.status(200).json(null);

}

        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const updateResume = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            summary,
            github,
            linkedin,
            portfolio,
            experience,
            certifications,
            achievements
        } = req.body;

        const result = await pool.query(
            `
            UPDATE resume
            SET
                summary = $1,
                github = $2,
                linkedin = $3,
                portfolio = $4,
                experience = $5,
                certifications = $6,
                achievements = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $8
            RETURNING *;
            `,
            [
                summary,
                github,
                linkedin,
                portfolio,
                experience,
                certifications,
                achievements,
                userId
            ]
        );

    if (result.rows.length === 0) {

    return res.status(404).json({
        message: "Resume not found."
    });

}

        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const saveResume = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            summary,
            github,
            linkedin,
            portfolio,
            experience,
            certifications,
            achievements,
        } = req.body;

        const existingResume = await pool.query(
            `
            SELECT resume_id
            FROM resume
            WHERE user_id = $1
            `,
            [userId]
        );

        if (existingResume.rows.length === 0) {

            const result = await pool.query(
                `
                INSERT INTO resume
                (
                    user_id,
                    summary,
                    github,
                    linkedin,
                    portfolio,
                    experience,
                    certifications,
                    achievements
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING *;
                `,
                [
                    userId,
                    summary,
                    github,
                    linkedin,
                    portfolio,
                    experience,
                    certifications,
                    achievements,
                ]
            );

            return res.status(201).json(result.rows[0]);

        }

        const result = await pool.query(
            `
            UPDATE resume
            SET
                summary = $1,
                github = $2,
                linkedin = $3,
                portfolio = $4,
                experience = $5,
                certifications = $6,
                achievements = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $8
            RETURNING *;
            `,
            [
                summary,
                github,
                linkedin,
                portfolio,
                experience,
                certifications,
                achievements,
                userId,
            ]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Failed to save resume."
        });

    }

};