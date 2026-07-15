import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req,res) => {
    
    try{

    const{
        name, 
        email,
        password,
        university,
        major,
        year,
        graduation_year
    } = req.body;

    if (!name || !email || !password || !university || !major ||!year ||!graduation_year){
        return res.status(400).json({
            message:"All required fields are mandatory."
        });
    }

    const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1", [email]
    );

    if (existingUser.rows.length > 0) {
        return res.status(400).json({
            message:"Email already exists."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
        `
        INSERT INTO users(
        name,
        email,
        password,
        university,
        major,
        year,
        graduation_year
        )

        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,
        [
            name,
            email,
            hashedPassword,
            university,
            major,
            year,
            graduation_year
        ]
    );

    return res.status(201).json({
        message: "User registered successfully"
    });
}

catch(error){
    console.error("Signup Error:",error);

    return res.status(500).json({
        message:"Internal server error"
    });

}
};

export const login = async (req,res) => {
   
    const {
        email,
        password
    } = req.body;

    if (!email || !password){
        return res.status(400).json({
            message:"Email and Password are required."
        });
    }

    const user = await pool.query(
        `SELECT * FROM users
         WHERE email = $1
        `,
        [email]
    );

    if (user.rows.length === 0){
        return res.status(400).json({
            message:"Invalid Email or Password"
        });
    };

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.rows[0].password
    );

    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            user_id: user.rows[0].user_id,
            email: user.rows[0].email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    )

    return res.status(200).json({
        message:"Login successful.",
        token,
        user:{
            user_id: user.rows[0].user_id,
            name: user.rows[0].name,
            email:user.rows[0].email
        }
    });
};

export const getProfile = async (req, res) => {

    const userId = req.user.user_id;

    try {

        const user = await pool.query(
            `
            SELECT
                name,
                email,
                university,
                major,
                year,
                graduation_year
            FROM users
            WHERE user_id = $1;
            `,
            [userId]
        );

        if (user.rows.length === 0) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        return res.status(200).json(user.rows[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const updateProfile = async (req, res) => {

    const userId = req.user.user_id;

    const {
        name,
        university,
        major,
        year,
        graduation_year
    } = req.body;

    if (
        !name ||
        !university ||
        !major ||
        !year ||
        !graduation_year
    ) {

        return res.status(400).json({
            message: "All fields are required."
        });

    }

    try {

        const updatedUser = await pool.query(
            `
            UPDATE users
            SET
                name = $1,
                university = $2,
                major = $3,
                year = $4,
                graduation_year = $5
            WHERE user_id = $6
            RETURNING
                name,
                email,
                university,
                major,
                year,
                graduation_year;
            `,
            [
                name,
                university,
                major,
                year,
                graduation_year,
                userId
            ]
        );

        return res.status(200).json({

            message: "Profile updated successfully.",

            user: updatedUser.rows[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};

export const changePassword = async (req, res) => {

    const userId = req.user.user_id;

    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = req.body;

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        return res.status(400).json({
            message: "All fields are required."
        });

    }

    if (newPassword !== confirmPassword) {

        return res.status(400).json({
            message: "Passwords do not match."
        });

    }

    try {

        const user = await pool.query(
            `
            SELECT password
            FROM users
            WHERE user_id = $1;
            `,
            [userId]
        );

        if (user.rows.length === 0) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        const isCorrect = await bcrypt.compare(
            currentPassword,
            user.rows[0].password
        );

        if (!isCorrect) {

            return res.status(400).json({
                message: "Current password is incorrect."
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE user_id = $2;
            `,
            [
                hashedPassword,
                userId
            ]
        );

        return res.status(200).json({
            message: "Password updated successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database Error"
        });

    }

};