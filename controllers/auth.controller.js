import pool from "../config/db.js";
import bcrypt from "bcrypt";

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