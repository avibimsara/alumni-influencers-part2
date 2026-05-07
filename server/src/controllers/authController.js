import bcrypt from "bcrypt";
import User from "../models/User.js";
import sendEmail from "../utils/mailer.js";
import { generateToken } from "../utils/tokens.js";
import {
  verificationEmailHtml,
  resetEmailHtml,
} from "../utils/emailTemplates.js";
import jwt from "jsonwebtoken";

// Register a new user
export const register = async (req, res, next) => {
  console.log("Register hit");
  console.log("Body:", req.body);
  try {
    const { email, password } = req.body;
    // Check uni domain
    if (!email.endsWith("@iit.ac.lk")) {
      console.log("Domain check failed");
      return res
        .status(400)
        .json({ message: "Email must be a university email" });
    }
    console.log("Domain check passed");

    // Check if email already exists
    const existingUser = await User.findUserByEmail(email);
    console.log("Existing user check done:", existingUser);

    if (existingUser) {
      return res.status(201).json({ message: "Email verification link sent" });
    }

    // Hash password
    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash(password, 12); // 12 salt rounds
    console.log("Password hashed");

    // Generate verification token and expiry
    const verificationToken = generateToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in DB
    console.log("Creating user...");
    await User.createUser({
      email,
      passwordHash,
      verificationToken,
      verificationExpiry,
    });
    console.log("User created");

    // Send verification email
    console.log("Sending email...");
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: verificationEmailHtml(verifyLink),
    });
    console.log("Email sent");

    // Retyrn success response
    res.status(201).json({ message: "Email verification link sent" });
  } catch (error) {
    console.error("Error in register:", error);
    console.error("Register error:", error);
    next(error);
  }
};

// Verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findUserByVerificationToken(token);

    // Same for invalid and expired tokens
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Check if token is expired
    if (new Date() > new Date(user.verification_expiry)) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Flip is_verified to true and clear token
    await User.verifyUserEmail(user.id);

    // Return success
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findUserByEmail(email);

    // Timing attack defence same response
    const DUMMY_HASH =
      "$2b$12$KIXQJYVqjH7ZyTtXj3e5uO8r1s9v1h6Z8f9g0h1j2k3l4m5n6o";
    const passwordToCheck = user ? user.password_hash : DUMMY_HASH;
    const passwordMatch = await bcrypt.compare(password, passwordToCheck);

    // Reject if no user
    if (!user || !passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check email verified
    if (!user.is_verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    // Sign JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Return token
    return res
      .status(200)
      .json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
};

//Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findUserByEmail(email);

    // Return same response for enumeration defence
    if (!user) {
      return res
        .status(200)
        .json({ message: "Password reset link sent if email exists" });
    }

    // Generate token
    const resetToken = generateToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Store hashed token and expiry in DB
    await User.setResetToken(user.id, resetToken, resetExpiry);

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: resetEmailHtml(resetLink),
    });

    return res
      .status(200)
      .json({ message: "Password reset link sent if email exists" });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
    console.log('Reset password body:', req.body);
    console.log('Token:', req.params.token);
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token
    const user = await User.findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if token is expired
    if (new Date() > new Date(user.reset_expiry)) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Hash new password and update user
    const passwordHash = await bcrypt.hash(password, 12);
    await User.updateUserPassword(user.id, passwordHash);

    // Return success
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
