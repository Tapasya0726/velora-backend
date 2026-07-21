import pool from "../config/db.js";

export const createSkill = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            skill_name,
            category,
            progress
        } = req.body;

        let level;

        if (progress < 40) {

            level = "Beginner";

        } else if (progress < 75) {

            level = "Intermediate";

        } else {

            level = "Advanced";

        }

        const result = await pool.query(
            `
            INSERT INTO skills
            (
                user_id,
                skill_name,
                category,
                progress,
                level
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            RETURNING *;
            `,
            [
                userId,
                skill_name,
                category,
                progress,
                level
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

export const getSkills = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT *
            FROM skills
            WHERE user_id = $1
            ORDER BY category ASC, skill_name ASC;
            `,
            [userId]
        );

        return res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const updateSkill = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const { id } = req.params;

        const {
            skill_name,
            category,
            progress
        } = req.body;

        let level;

        if (progress < 40) {

            level = "Beginner";

        } else if (progress < 75) {

            level = "Intermediate";

        } else {

            level = "Advanced";

        }

        const result = await pool.query(
            `
            UPDATE skills
            SET
                skill_name = $1,
                category = $2,
                progress = $3,
                level = $4
            WHERE skill_id = $5
            AND user_id = $6
            RETURNING *;
            `,
            [
                skill_name,
                category,
                progress,
                level,
                id,
                userId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Skill not found"
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

export const deleteSkill = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM skills
            WHERE skill_id = $1
            AND user_id = $2
            RETURNING *;
            `,
            [
                id,
                userId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Skill not found"
            });

        }

        return res.status(200).json({
            message: "Skill deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const getSkillStats = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT

                COUNT(*) AS total,

                ROUND(AVG(progress), 0) AS average_progress,

                COUNT(*) FILTER (
                    WHERE level = 'Beginner'
                ) AS beginner,

                COUNT(*) FILTER (
                    WHERE level = 'Intermediate'
                ) AS intermediate,

                COUNT(*) FILTER (
                    WHERE level = 'Advanced'
                ) AS advanced

            FROM skills
            WHERE user_id = $1;
            `,
            [userId]
        );

        const stats = result.rows[0];

        return res.status(200).json({

            total: Number(stats.total),

            averageProgress: Number(stats.average_progress) || 0,

            beginner: Number(stats.beginner),

            intermediate: Number(stats.intermediate),

            advanced: Number(stats.advanced)

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const getTopSkills = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT
                skill_id,
                skill_name,
                category,
                level,
                progress
            FROM skills
            WHERE user_id = $1
            ORDER BY progress DESC
            LIMIT 3;
            `,
            [userId]
        );

        console.log("Rows:", result.rows);

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch top skills."
        });

    }

};