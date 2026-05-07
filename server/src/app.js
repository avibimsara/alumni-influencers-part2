import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from './routes/authRoutes.js'; 
import apiKeyRoutes from './routes/apiKeys.js';
import alumniRoutes  from './routes/alumni.js';       
import analyticsRoutes from './routes/analytics.js'; 
import externalRoutes from './routes/external.js';
import requireAuth from './middleware/requireAuth.js'; 
import errorHandler from "./middleware/errorHandler.js";
import User from './models/User.js';

const app = express();

//Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//health check endpoint
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes); // auth routes
app.use("/api/admin/api-keys", apiKeyRoutes); // admin API key management routes
app.use("/api/alumni", alumniRoutes); // alumni data routes (require auth)
app.use("/api/analytics", analyticsRoutes); // analytics data routes (require auth)
app.use("/api/external", externalRoutes); // external clients routes (require API key)


app.use(errorHandler);
export default app;
