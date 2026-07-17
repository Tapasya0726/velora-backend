import pool from "../config/db.js";

export const getDashboardStats = async (req, res) => {

    try {

        const userId = req.user.user_id;

        // Focus Time
        const focusResult = await pool.query(
            `
            SELECT
                COALESCE(SUM(duration), 0) AS total_focus_minutes
            FROM focus_sessions
            WHERE user_id = $1
            AND mode = 'WORK';
            `,
            [userId]
        );

        // Application Statistics
        const applicationResult = await pool.query(
            `
            SELECT
                COUNT(*) AS total_applications,

                COUNT(*) FILTER (
                    WHERE status = 'Interview'
                ) AS interviews

            FROM applications
            WHERE user_id = $1;
            `,
            [userId]
        );

        return res.status(200).json({

            totalFocusMinutes:
                Number(focusResult.rows[0].total_focus_minutes),

            totalApplications:
                Number(applicationResult.rows[0].total_applications),

            interviews:
                Number(applicationResult.rows[0].interviews)

        });

    } catch (error) {

        console.error("Dashboard Error:", error);

        return res.status(500).json({
            message: error.message
        });

    }

};