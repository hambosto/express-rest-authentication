import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.status(403).json({
                status: 403,
                error: "Forbidden",
                error_message: "User not authenticated."
            });
        }

        if (currentUserId.toString() !== id) {
            return res.status(403).json({
                status: 403,
                error: "Forbidden",
                error_message: "User does not have permission to access this resource."
            });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred while checking ownership."
        });
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['X-APP-COOKIE-AUTH'];

        if (!sessionToken) {
            return res.status(400).json({
                status: 400,
                error: "Bad Request",
                error_message: "Session token is required."
            });
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(403).json({
                status: 403,
                error: "Forbidden",
                error_message: "Invalid session token."
            });
        }

        merge(req, { identity: existingUser });

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred while checking authentication."
        });
    }
}
