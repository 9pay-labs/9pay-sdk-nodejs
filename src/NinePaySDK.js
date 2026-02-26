const { ENDPOINTS } = require('./constants');
const { request } = require('./http');
const {
    getTimestamp,
    generateInvoiceNo,
    buildHttpQuery,
    buildSignature
} = require('./utils');

class NinePaySDK {
    constructor({ merchantKey, merchantSecret, env = 'sandbox', endpoint }) {
        if (!merchantKey || !merchantSecret) {
            throw new Error('merchantKey & merchantSecret are required');
        }

        this.merchantKey = merchantKey;
        this.merchantSecret = merchantSecret;
        this.endpoint = endpoint || ENDPOINTS[env];

        if (!this.endpoint) {
            throw new Error('Invalid env');
        }
    }

    /** CREATE PAYMENT */
    createPayment({ amount, description, return_url, back_url, invoice_no }) {
        if (!amount || !description || !return_url) {
            throw new Error('amount, description, return_url are required');
        }

        const time = getTimestamp();
        const invoiceNo = invoice_no || generateInvoiceNo();

        const payload = {
            merchantKey: this.merchantKey,
            time,
            invoice_no: invoiceNo,
            amount,
            description,
            return_url,
            back_url: back_url || return_url
        };

        const query = buildHttpQuery(payload);

        const message = [
            'POST',
            this.endpoint + '/payments/create',
            time,
            query
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);
        const baseEncode = Buffer.from(JSON.stringify(payload)).toString('base64');

        return {
            invoiceNo,
            redirectUrl:
                `${this.endpoint}/portal?` +
                buildHttpQuery({ baseEncode, signature }),
            signature,
            time
        };
    }

    /** INQUIRE PAYMENT */
    async inquirePayment(invoiceNo) {
        if (!invoiceNo) throw new Error('invoiceNo is required');

        const time = getTimestamp();
        const path = `/v2/payments/${invoiceNo}/inquire`;

        const message = [
            'GET',
            this.endpoint + path,
            time
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);

        return request(this.endpoint + path, {
            method: 'GET',
            headers: {
                Date: time,
                Authorization:
                    `Signature Algorithm=HS256,` +
                    `Credential=${this.merchantKey},` +
                    `SignedHeaders=,` +
                    `Signature=${signature}`
            }
        });
    }

    /** REFUND */
    async refund({ invoiceNo, amount, reason }) {
        if (!invoiceNo || !amount) {
            throw new Error('invoiceNo & amount are required');
        }

        const time = getTimestamp();
        const path = '/v2/payments/refund';

        const body = buildHttpQuery({
            invoice_no: invoiceNo,
            amount,
            reason
        });

        const message = [
            'POST',
            this.endpoint + path,
            time,
            body
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);

        return request(this.endpoint + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Date: time,
                Authorization:
                    `Signature Algorithm=HS256,` +
                    `Credential=${this.merchantKey},` +
                    `SignedHeaders=,` +
                    `Signature=${signature}`
            },
            body
        });
    }

    /** PAYER AUTH (CIT / MIT - Card Direct API) */
    async payerAuth(payload) {
        if (!payload) {
            throw new Error('payload is required');
        }

        if (!payload.request_id) {
            throw new Error('request_id is required');
        }

        if (!payload.amount) {
            throw new Error('amount is required');
        }

        if (!payload.card) {
            throw new Error('card is required');
        }

        const time = getTimestamp();
        const path = '/v2/payments/payer-auth';

        const body = JSON.stringify(payload);

        const message = [
            'POST',
            this.endpoint + path,
            time,
            body
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);

        return request(this.endpoint + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Date: time,
                Authorization:
                    `Signature Algorithm=HS256,` +
                    `Credential=${this.merchantKey},` +
                    `SignedHeaders=,` +
                    `Signature=${signature}`
            },
            body
        });
    }

    /** AUTHORIZE (Pre-auth Card) */
    async authorize(payload) {
        if (!payload) {
            throw new Error('payload is required');
        }

        if (!payload.request_id) {
            throw new Error('request_id is required');
        }

        if (!payload.order_code) {
            throw new Error('order_code is required');
        }

        if (!payload.amount) {
            throw new Error('amount is required');
        }

        if (!payload.card) {
            throw new Error('card is required');
        }

        const time = getTimestamp();
        const path = '/v2/payments/authorize';
        const body = JSON.stringify(payload);

        const message = [
            'POST',
            this.endpoint + path,
            time,
            body
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);

        return request(this.endpoint + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Date: time,
                Authorization:
                    `Signature Algorithm=HS256,` +
                    `Credential=${this.merchantKey},` +
                    `SignedHeaders=,` +
                    `Signature=${signature}`
            },
            body
        });
    }

    /** CAPTURE (Confirm Pre-authorized Payment) */
    async capture(payload) {
        if (!payload) {
            throw new Error('payload is required');
        }

        if (!payload.request_id) {
            throw new Error('request_id is required');
        }

        if (!payload.order_code) {
            throw new Error('order_code is required');
        }

        if (!payload.amount) {
            throw new Error('amount is required');
        }

        const time = getTimestamp();
        const path = '/v2/payments/capture';
        const body = JSON.stringify(payload);

        const message = [
            'POST',
            this.endpoint + path,
            time,
            body
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);

        return request(this.endpoint + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Date: time,
                Authorization:
                    `Signature Algorithm=HS256,` +
                    `Credential=${this.merchantKey},` +
                    `SignedHeaders=,` +
                    `Signature=${signature}`
            },
            body
        });
    }

    /** INIT FROM ENV */
    static fromEnv() {
        require('dotenv').config();

        return new NinePaySDK({
            merchantKey: process.env.NINEPAY_MERCHANT_KEY,
            merchantSecret: process.env.NINEPAY_MERCHANT_SECRET,
            env: process.env.NINEPAY_ENV || 'sandbox'
        });
    }
}

module.exports = NinePaySDK;
