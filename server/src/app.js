import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

//Middleware
app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;