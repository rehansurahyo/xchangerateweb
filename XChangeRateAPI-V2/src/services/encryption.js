const CryptoJS = require('crypto-js');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is required in .env file.');
}

/**
 * Encrypts a string using AES-256
 * @param {string} text 
 * @returns {string} 
 */
function encrypt(text) {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

/**
 * Decrypts a string using AES-256
 * @param {string} ciphertext 
 * @returns {string}
 */
function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) {
        throw new Error('Decryption failed. Check your ENCRYPTION_KEY.');
    }
    return originalText;
}

module.exports = {
    encrypt,
    decrypt
};
