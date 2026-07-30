import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "./auth.interface";

const signupUserIntoDB = async (user: IUser) => {
    let { name, email, password, role } = user;
    if (!role)
        role = 'contributor';
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4) RETURNING *;
        `, [name, email, hashedPassword, role]);
    delete result?.rows[0]?.password;

    return result?.rows[0];
}

const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1`, [email]);

    if (userData.rows.length !== 1) {
        throw new Error(`User with email ${email} not found`);
    }
    const user = userData.rows[0];

    const matchPassword = await bcrypt.compare(password, user?.password);
    if (!matchPassword)
        throw new Error(`Invalid credential`);

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    const token = jwt.sign(jwtPayload, config.jwt_secret as string, { expiresIn: `${config.jwt_expire}d` });
    delete user?.password;

    return { token, user };
}

export const authService = {
    signupUserIntoDB,
    loginUserIntoDB
}