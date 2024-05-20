import express from 'express';
import { login, register } from '../controllers/authentication';

export default (router: express.Router) => {
    // Route for user registration
    router.post('/auth/register', register);
    
    // Route for user login
    router.post('/auth/login', login);
};
