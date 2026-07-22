import pool from "../config/db.js";
import ROADMAP_TEMPLATES from "../constants/roadmapTemplates.js";

export const selectRoadmap = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const { roadmapType } = req.body;

        const roadmap = ROADMAP_TEMPLATES[roadmapType];

        if (!roadmap) {

            return res.status(400).json({

                message: "Invalid roadmap selected."

            });

        }

        const existingRoadmap = await pool.query(

            `
            SELECT *

            FROM roadmap_items

            WHERE user_id = $1

            AND roadmap_type = $2;
            `,

            [
                userId,
                roadmapType
            ]

        );

        if (existingRoadmap.rows.length > 0) {

            return res.status(200).json({

                message: "Roadmap already exists."

            });

        }

        for (const item of roadmap) {

            await pool.query(

                `
                INSERT INTO roadmap_items
                (
                    user_id,
                    roadmap_type,
                    title,
                    duration,
                    status
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                );
                `,

                [
                    userId,
                    roadmapType,
                    item.title,
                    item.duration,
                    "Pending"
                ]

            );

            await pool.query(

                `
                INSERT INTO resources
                (
                    user_id,
                    roadmap_type,
                    title,
                    type,
                    category,
                    link
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                );
                `,

                [
                    userId,
                    roadmapType,
                    item.resourceTitle,
                    item.resourceType,
                    roadmapType,
                    item.resourceLink
                ]

            );

        }

        return res.status(201).json({

            message: "Roadmap created successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};

export const getRoadmap = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const roadmapItems = await pool.query(

            `
            SELECT *

            FROM roadmap_items

            WHERE user_id = $1

            ORDER BY roadmap_item_id;
            `,

            [userId]

        );

        if (roadmapItems.rows.length === 0) {

            return res.status(200).json({

                roadmapType: null,
                progress: 0,
                roadmapItems: [],
                resources: []

            });

        }

        const roadmapType = roadmapItems.rows[0].roadmap_type;

        const resources = await pool.query(

            `
            SELECT
                resource_id,
                title,
                type,
                category,
                link

            FROM resources

            WHERE user_id = $1

            AND roadmap_type = $2;
            `,

            [
                userId,
                roadmapType
            ]

        );

        const completedItems = roadmapItems.rows.filter(

            item => item.status === "Completed"

        ).length;

        const totalItems = roadmapItems.rows.length;

        const progress = Math.round(

            (completedItems / totalItems) * 100

        );

        return res.status(200).json({

            roadmapType,

            progress,

            roadmapItems: roadmapItems.rows,

            resources: resources.rows

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};

export const updateRoadmapStatus = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const { roadmapItemId } = req.params;

        const { status } = req.body;

        if (status !== "Pending" && status !== "Completed") {

            return res.status(400).json({

                message: "Invalid status."

            });

        }

        const result = await pool.query(

            `
            UPDATE roadmap_items

            SET status = $1

            WHERE roadmap_item_id = $2

            AND user_id = $3

            RETURNING *;
            `,

            [
                status,
                roadmapItemId,
                userId
            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Roadmap item not found."

            });

        }

        return res.status(200).json({

            message: "Roadmap status updated successfully.",

            roadmapItem: result.rows[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};