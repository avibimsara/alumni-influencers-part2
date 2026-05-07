import crypto from 'crypto';

// Generate a secure random token
export const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash the token using SHA-256
export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};