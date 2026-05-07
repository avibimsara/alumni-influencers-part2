import rateLimit from "express-rate-limit";

// Login rate limiter - max 5 attempts per 15 mins
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in header
  legacyHeaders: false, // Disable the x ratelimit headers
});

// Register rate limiter - 3 attempts per hour
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: "Too many registration attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot password rate limiter - 3 attempts per hour
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: "Too many password reset attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
