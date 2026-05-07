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

// Test protected route — delete this after testing
app.get('/api/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
export default app;
