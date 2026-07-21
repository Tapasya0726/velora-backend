import pool from "../config/db.js";

export const createEducation = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            institution,
            degree,
            cgpa,
            start_year,
            end_year
        } = req.body;

        const resumeResult = await pool.query(
            `
            SELECT resume_id
            FROM resume
            WHERE user_id = $1;
            `,
            [userId]
        );

        if (resumeResult.rows.length === 0) {

            return res.status(404).json({
                message: "Resume not found."
            });

        }

        const resumeId = resumeResult.rows[0].resume_id;

        const result = await pool.query(
            `
            INSERT INTO education
            (
                resume_id,
                institution,
                degree,
                cgpa,
                start_year,
                end_year
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6
            )
            RETURNING *;
            `,
            [
                resumeId,
                institution,
                degree,
                cgpa,
                start_year,
                end_year
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

export const getEducation = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const resumeResult = await pool.query(
            `
            SELECT resume_id
            FROM resume
            WHERE user_id = $1;
            `,
            [userId]
        );

  if (resumeResult.rows.length === 0) {
    return res.status(200).json([]);
}

        const resumeId = resumeResult.rows[0].resume_id;

        const result = await pool.query(
            `
            SELECT *
            FROM education
            WHERE resume_id = $1
            ORDER BY start_year DESC;
            `,
            [resumeId]
        );

        return res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const updateEducation = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const educationId = req.params.id;

        const {
            institution,
            degree,
            cgpa,
            start_year,
            end_year
        } = req.body;

        // Verify that the education record belongs to the logged-in user
        const educationResult = await pool.query(
            `
            SELECT e.education_id
            FROM education e
            JOIN resume r
            ON e.resume_id = r.resume_id
            WHERE e.education_id = $1
            AND r.user_id = $2;
            `,
            [educationId, userId]
        );

        if (educationResult.rows.length === 0) {

            return res.status(404).json({
                message: "Education record not found."
            });

        }

        const result = await pool.query(
            `
            UPDATE education
            SET
                institution = $1,
                degree = $2,
                cgpa = $3,
                start_year = $4,
                end_year = $5
            WHERE education_id = $6
            RETURNING *;
            `,
            [
                institution,
                degree,
                cgpa,
                start_year,
                end_year,
                educationId
            ]
        );

        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const deleteEducation = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const educationId = req.params.id;

        // Verify ownership
        const educationResult = await pool.query(
            `
            SELECT e.education_id
            FROM education e
            JOIN resume r
            ON e.resume_id = r.resume_id
            WHERE e.education_id = $1
            AND r.user_id = $2;
            `,
            [educationId, userId]
        );

        if (educationResult.rows.length === 0) {

            return res.status(404).json({
                message: "Education record not found."
            });

        }

        await pool.query(
            `
            DELETE FROM education
            WHERE education_id = $1;
            `,
            [educationId]
        );

        return res.status(200).json({
            message: "Education deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};