import { body, validationResult } from "express-validator";

// Middleware to validate request body for registration
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Password validation rules
const passwordRules = () =>
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .escape();

// Registration validation rules
export const registrationRules = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith("@iit.ac.lk")) {
        throw new Error("Email must be university email");
      }
      return true;
    }),
  passwordRules(),
];

// Login validation rules
export const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required").escape(),
];

// Forgot password validation rules
export const forgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

// Reset password validation rules
export const resetPasswordValidator = [passwordRules()];
