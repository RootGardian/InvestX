const crypto = require('crypto');
const bcrypt = require('bcrypt');

const pepper = process.env.PASSWORD_PEPPER || 'fallback_secret_pepper_value_123!';

/**
 * Prepares a password using HMAC-SHA256 with a secret pepper.
 * This handles the pepper requirement and outputs a 64-char hex string,
 * avoiding bcrypt's 72-byte limit.
 */
const getPepperedPassword = (password) => {
    return crypto.createHmac('sha256', pepper).update(password).digest('hex');
};

/**
 * Hashes password using automatic bcrypt salt and custom pepper.
 */
const hashPassword = async (password) => {
    const peppered = getPepperedPassword(password);
    // bcrypt handles the salt automatically
    return await bcrypt.hash(peppered, 10);
};

/**
 * Compares plain password with stored hash.
 */
const comparePassword = async (password, hash) => {
    const peppered = getPepperedPassword(password);
    return await bcrypt.compare(peppered, hash);
};

module.exports = {
    hashPassword,
    comparePassword
};
