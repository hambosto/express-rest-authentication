import express from 'express';
import authentication from './authentication';
import users from './users';

const router = express.Router();

// Initialize authentication routes
authentication(router);

// Initialize user routes
users(router);

// Export the router
export default (): express.Router => router;
