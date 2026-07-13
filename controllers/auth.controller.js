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

    if (!name || !email || !password || !university ||!year){
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
            expiresIn:"1h"
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