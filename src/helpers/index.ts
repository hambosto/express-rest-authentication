import crypto from 'crypto';

// Hardcoded secret key?
const SECRET_KEY = "Got-My-Key?";

export const random = (): string => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string): string => {
    return crypto
        .createHmac('sha256', [salt, password].join('/'))
        .update(SECRET_KEY)
        .digest('hex');
};
