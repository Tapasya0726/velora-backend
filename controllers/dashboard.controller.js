import pool from "../config/db.js";

export const getDashboardStats = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT
                COALESCE(SUM(duration),0) AS total_focus_minutes
            FROM focus_sessions
            WHERE user_id = $1
            AND mode = 'WORK';
            `,
            [userId]
        );

        return res.status(200).json({
            totalFocusMinutes: Number(result.rows[0].total_focus_minutes)
        });

    } catch (error) {

    console.error("Dashboard Error:", error);

    return res.status(500).json({
        message: error.message
    });

}
};