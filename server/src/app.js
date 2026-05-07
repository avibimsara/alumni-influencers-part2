import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from './routes/authRoutes.js'; 
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


app.use(errorHandler);
export default app;
