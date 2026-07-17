import pool from "../config/db.js";

export const getTasks = async (req, res) => {
  try{
    const userId = req.user.user_id;

    const tasks = await pool.query(
        `
        SELECT *
        FROM tasks 
        WHERE user_id = $1
        ORDER BY due_date ASC;
        `,
        [userId]
    );

    return res.status(200).json(tasks.rows);
}   catch (error) {
    console.error(error);

    return res.status(500).json({
        message:"database error"
    });
}

};

export const getGoals = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(

            `
            SELECT *

            FROM tasks

            WHERE user_id = $1

            AND status = 'Pending'

            ORDER BY

            CASE

                WHEN priority = 'High' THEN 1

                WHEN priority = 'Medium' THEN 2

                ELSE 3

            END,

            due_date ASC

            LIMIT 5;
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

    export const createTask = async (req, res) => {
        try{
    const {
        title,
        priority,
        due_date
    } = req.body;

    const userId = req.user.user_id;

    if(!title || !priority || !due_date){
        return res.status(400).json({
            message:"Title. priority and due date are required."
        });
    }

    const newTask = await pool.query(
        `
        INSERT INTO tasks (
        user_id,
        title,
        priority,
        due_date
        )

        VALUES($1, $2, $3, $4)
        RETURNING *;
        `,
        [
            userId,
            title,
            priority,
            due_date
        ]
    );

    return res.status(201).json({
    message: "Task created successfully",
    task: newTask.rows[0]
});
        }
        catch (error){
             console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });
        }

}

export const updateTask = async (req, res) => {
    const taskId = req.params.id;

    const{
        title,
        priority,
        due_date,
        status
    } = req.body;

    const userId = req.user.user_id;

    if (!title || !priority || !due_date || !status){
        return res.status(400).json({
            message:"All fields are required."
        });
    }

    try{

        const updatedTask = await pool.query(
            `
            UPDATE  tasks 
            SET 
               title = $1,
               priority = $2,
               due_date = $3,
               status = $4
            WHERE task_id = $5
            and user_id = $6
            RETURNING *;
            `,
            [
                title,
                priority,
                due_date,
                status,
                taskId,
                userId
            ]
        );

        if (updatedTask.rows.length === 0) {
            return res.status(404).json({
                message:"Task not found or you are not authorized to update it."
            });
        }

        return res.status(200).json({
            message:"Task updated successfully",
            task: updatedTask.rows[0]
        });
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });
    }

};


export const completeTask = async (req, res) => {

    const taskId = req.params.id;

    const userId = req.user.user_id;

    try {

        const result = await pool.query(

            `
            UPDATE tasks

            SET status = 'Completed'

            WHERE task_id = $1
            AND user_id = $2

            RETURNING *;
            `,

            [
                taskId,
                userId
            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Task not found."

            });

        }

        return res.status(200).json({

            message: "Task completed.",

            task: result.rows[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Database Error"

        });

    }

};

export const deleteTask = async (req,res) =>{

    const taskId = req.params.id;
    const userId = req.user.user_id;

    try{

        const deletedTask = await pool.query(
            `
            DELETE FROM tasks
            WHERE task_id = $1
            AND user_id = $2
            RETURNING *;
            `,
            [
                taskId,
                userId
            ]
        );

        if (deletedTask.rows.length === 0) {
            return res.status(404).json({
                message:"Task not found or you are not authorized to delete it."
            });
        }

        return res.status(200).json({
            message:"Task deleted successfully",
            task: deletedTask.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message:"Database Error"
        });
    }

};