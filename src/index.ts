import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/");
});

const MONGO_URL = process.env['MONGO_URL'];

if (!MONGO_URL) {
    console.error("MONGO_URL environment variable is required.");
    process.exit(1);
}

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on('error', (error: Error) => {
    console.error("MongoDB connection error:", error);
});

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB successfully");
});

app.use('/', router());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
