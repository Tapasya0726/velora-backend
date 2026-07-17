import pool from "../config/db.js";

export const addApplication = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            company_name,
            role,
            status,
            applied_date
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO applications
            (
                user_id,
                company_name,
                role,
                status,
                applied_date
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *;
            `,
            [
                userId,
                company_name,
                role,
                status,
                applied_date
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

export const getApplications = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT *
            FROM applications
            WHERE user_id = $1
            ORDER BY applied_date DESC;
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

export const updateApplication = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const { id } = req.params;

        const {
            company_name,
            role,
            status,
            applied_date
        } = req.body;

        const result = await pool.query(
            `
            UPDATE applications
            SET
                company_name = $1,
                role = $2,
                status = $3,
                applied_date = $4
            WHERE application_id = $5
            AND user_id = $6
            RETURNING *;
            `,
            [
                company_name,
                role,
                status,
                applied_date,
                id,
                userId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Application not found"
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

export const deleteApplication = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM applications
            WHERE application_id = $1
            AND user_id = $2
            RETURNING *;
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Application not found"
            });

        }

        return res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const getApplicationStats = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT

                COUNT(*) AS total,

                COUNT(*) FILTER (
                    WHERE status = 'Applied'
                ) AS applied,

                COUNT(*) FILTER (
                    WHERE status = 'Interview'
                ) AS interview,

                COUNT(*) FILTER (
                    WHERE status = 'Offer'
                ) AS offer,

                COUNT(*) FILTER (
                    WHERE status = 'Rejected'
                ) AS rejected

            FROM applications
            WHERE user_id = $1;
            `,
            [userId]
        );

        const stats = result.rows[0];

        const total = Number(stats.total);

        const responses =
            Number(stats.interview) +
            Number(stats.offer) +
            Number(stats.rejected);

        const responseRate =
            total === 0
                ? 0
                : Math.round((responses / total) * 100);

        return res.status(200).json({

            total,

            applied: Number(stats.applied),

            interview: Number(stats.interview),

            offer: Number(stats.offer),

            rejected: Number(stats.rejected),

            responseRate

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};