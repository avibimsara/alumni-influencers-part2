import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
  try {
    // Step 1 — Read Authorization header
    const authHeader = req.headers.authorization;

    // Step 2 — Check header exists and is Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorised - no token provided' });
    }

    // Step 3 — Extract token after "Bearer "
    const token = authHeader.split(' ')[1];

    // Step 4 — Verify token (throws if invalid or expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5 — Attach userId to req.user for downstream handlers
    req.user = { userId: decoded.userId };

    next();

  } catch (error) {
    // jwt.verify throws if token is invalid or expired
    return res.status(401).json({ message: 'Unauthorised - invalid or expired token' });
  }
};

export default requireAuth;