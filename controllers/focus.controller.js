import pool from "../config/db.js";

export const saveSession = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            mode,
            duration
        } = req.body;

        const session = await pool.query(

            `
            INSERT INTO focus_sessions
            (
                user_id,
                mode,
                duration
            )

            VALUES
            (
                $1,
                $2,
                $3
            )

            RETURNING *;
            `,

            [
                userId,
                mode,
                duration
            ]

        );

        return res.status(201).json({

            message: "Focus session saved.",

            session: session.rows[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};


export const getStats = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const sessions = await pool.query(

            `
            SELECT COUNT(*) AS total_sessions

            FROM focus_sessions

            WHERE user_id = $1

            AND mode = 'WORK';
            `,

            [userId]

        );

        const focusTime = await pool.query(

            `
            SELECT
                COALESCE(SUM(duration), 0) AS total_minutes

            FROM focus_sessions

            WHERE user_id = $1

            AND mode = 'WORK';
            `,

            [userId]

        );

        const streakResult = await pool.query(
    `
    SELECT DISTINCT TO_CHAR(completed_at, 'YYYY-MM-DD') AS day

    FROM focus_sessions

    WHERE user_id = $1
    AND mode = 'WORK'

    ORDER BY day DESC;
    `,
    [userId]
);

        let streak = 0;

        // Store all completed days in a Set for fast lookup
        const completedDaySet = new Set(
    streakResult.rows.map(row => row.day)
);

       let currentDay = new Date();
currentDay.setHours(0, 0, 0, 0);

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const today = formatDate(currentDay);

// Create yesterday's date
const yesterdayDate = new Date(currentDay);
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

const yesterday = formatDate(yesterdayDate);

        if (completedDaySet.has(today)) {

            // User already completed a session today

        } else if (completedDaySet.has(yesterday)) {

            // User hasn't focused today yet,
            // start counting from yesterday

            currentDay.setDate(currentDay.getDate() - 1);

        } else {

            // Streak is broken

            currentDay = null;

        }

        while (currentDay) {

            const dateString = formatDate(currentDay);

            if (completedDaySet.has(dateString)) {

                streak++;

                currentDay.setDate(
                    currentDay.getDate() - 1
                );

            } else {

                break;

            }

        }

        return res.status(200).json({

            sessions: Number(
                sessions.rows[0].total_sessions
            ),

            focusTime: Number(
                focusTime.rows[0].total_minutes
            ),

            streak

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};