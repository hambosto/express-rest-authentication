import express from 'express';
import { getAllUsers, deleteUser, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    // Get all users
    router.get('/users', isAuthenticated, getAllUsers);

    // Delete a user by ID
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);

    // Update a user by ID
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
};
