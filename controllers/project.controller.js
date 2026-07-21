import pool from "../config/db.js";

export const createProject = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            project_name,
            description,
            tech_stack,
            github_link,
            live_link
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
            INSERT INTO projects
            (
                resume_id,
                project_name,
                description,
                tech_stack,
                github_link,
                live_link
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6
            )
            RETURNING *;
            `,
            [
                resumeId,
                project_name,
                description,
                tech_stack,
                github_link,
                live_link
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

export const getProjects = async (req, res) => {

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
            FROM projects
            WHERE resume_id = $1
            ORDER BY project_id DESC;
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

export const updateProject = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const projectId = req.params.id;

        const {
            project_name,
            description,
            tech_stack,
            github_link,
            live_link
        } = req.body;

        const projectResult = await pool.query(
            `
            SELECT p.project_id
            FROM projects p
            JOIN resume r
            ON p.resume_id = r.resume_id
            WHERE p.project_id = $1
            AND r.user_id = $2;
            `,
            [projectId, userId]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        const result = await pool.query(
            `
            UPDATE projects
            SET
                project_name = $1,
                description = $2,
                tech_stack = $3,
                github_link = $4,
                live_link = $5
            WHERE project_id = $6
            RETURNING *;
            `,
            [
                project_name,
                description,
                tech_stack,
                github_link,
                live_link,
                projectId
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

export const deleteProject = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const projectId = req.params.id;

        const projectResult = await pool.query(
            `
            SELECT p.project_id
            FROM projects p
            JOIN resume r
            ON p.resume_id = r.resume_id
            WHERE p.project_id = $1
            AND r.user_id = $2;
            `,
            [projectId, userId]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        await pool.query(
            `
            DELETE FROM projects
            WHERE project_id = $1;
            `,
            [projectId]
        );

        return res.status(200).json({
            message: "Project deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

