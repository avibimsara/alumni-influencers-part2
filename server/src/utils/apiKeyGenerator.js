import crypto from 'crypto';

// Generate a new API key
export const generateApiKey = () => {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 32 chars
    return `ak_${randomPart}`;
};

// Hash an API key for secure storage
export const hashApiKey = (apiKey) => {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
};