const crypto = require('crypto');

function getTimestamp() {
    return new Date().toUTCString();
}

function generateInvoiceNo(length = 8) {
    return crypto.randomBytes(length).toString('hex').toUpperCase();
}

function buildHttpQuery(data) {
    const ordered = Object.keys(data)
        .sort()
        .reduce((obj, key) => {
            if (data[key] !== undefined && data[key] !== null) {
                obj[key] = data[key];
            }
            return obj;
        }, {});

    return new URLSearchParams(ordered).toString();
}

function buildSignature(message, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

module.exports = {
    getTimestamp,
    generateInvoiceNo,
    buildHttpQuery,
    buildSignature
};
