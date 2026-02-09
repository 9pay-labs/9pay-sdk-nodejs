const crypto = require('crypto');

/**
 * Unix timestamp (seconds) – string
 */
function getTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
}

/**
 * Random invoice number
 */
function generateInvoiceNo(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Build sorted query string
 */
function buildHttpQuery(data) {
    const keys = Object.keys(data)
        .filter(k => data[k] !== undefined && data[k] !== null)
        .sort();

    const params = new URLSearchParams();
    keys.forEach(key => {
        params.append(key, String(data[key]));
    });

    return params.toString();
}

/**
 * Build HMAC SHA256 signature (Base64)
 */
function buildSignature(message, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('base64');
}

module.exports = {
    getTimestamp,
    generateInvoiceNo,
    buildHttpQuery,
    buildSignature
};
