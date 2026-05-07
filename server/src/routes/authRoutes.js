import {Router} from 'express';
import {register, verifyEmail, login, forgotPassword, resetPassword} from '../controllers/authController.js';
import {registrationRules, loginRules, forgotPasswordValidator, resetPasswordValidator, validate} from '../middleware/validators.js';
import {loginLimiter, registerLimiter, forgotPasswordLimiter} from '../middleware/rateLimiters.js';
import requireAuth from '../middleware/requireAuth.js';
import User from '../models/User.js';

const router = Router();

// Register route
router.post('/register', registerLimiter, registrationRules, validate, register);
router.get('/verify-email/:token', verifyEmail); // user clicks link in email to verify
router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    next(error);
  }
});


export default router;