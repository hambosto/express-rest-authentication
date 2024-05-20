import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred while fetching users."
        });
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        if (!deletedUser) {
            return res.status(404).json({
                status: 404,
                error: "Not Found",
                error_message: "User not found."
            });
        }

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred while deleting the user."
        });
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                status: 400,
                error: "Bad Request",
                error_message: "Username is required."
            });
        }

        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({
                status: 404,
                error: "Not Found",
                error_message: "User not found."
            });
        }

        user.username = username;
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            error_message: "An error occurred while updating the user."
        });
    }
}
