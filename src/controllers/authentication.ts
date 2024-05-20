import express from 'express';
import { createUser, getUsersByEmail } from '../db/users';
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                error: "Bad Request",
                error_message: "Email and password are required."
            });
        }

        const user = await getUsersByEmail(email).select('authentication.salt authentication.password');

        if (!user) {
            return res.status(400).json({
                status: 400,
                error: "Invalid Credentials",
                error_message: "Invalid email or password."
            });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({
                status: 403,
                error: "Forbidden",
                error_message: "Invalid email or password."
            });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('X-APP-COOKIE-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/', httpOnly: true, secure: true });

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred during login."
        });
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                status: 400,
                error: "Bad Request",
                error_message: "Email, password, and username are required."
            });
        }

        const existingUser = await getUsersByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                error: "Conflict",
                error_message: "User with this email already exists."
            });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        return res.status(201).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred during registration."
        });
    }
};
