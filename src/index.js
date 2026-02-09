const {
    getTimestamp,
    generateInvoiceNo,
    buildHttpQuery,
    buildSignature
} = require('./utils');

const ENDPOINTS = {
    sandbox: 'https://sand-payment.9pay.vn',
    production: 'https://payment.9pay.vn'
};

class NinePaySDK {
    constructor({
                    merchantKey,
                    merchantSecret,
                    env = 'sandbox',
                    endpoint
                }) {
        if (!merchantKey || !merchantSecret) {
            throw new Error('merchantKey and merchantSecret are required');
        }

        this.merchantKey = merchantKey;
        this.merchantSecret = merchantSecret;
        this.endpoint = endpoint || ENDPOINTS[env];

        if (!this.endpoint) {
            throw new Error('Invalid env. Use sandbox or production');
        }
    }

    /**
     * CREATE PAYMENT
     * Return redirect URL
     */
    createPayment({
                      amount,
                      description,
                      return_url,
                      back_url,
                      invoice_no
                  }) {
        if (!amount || !description || !return_url) {
            throw new Error('amount, description, return_url are required');
        }

        const time = getTimestamp();
        const invoiceNo = invoice_no || generateInvoiceNo(8);

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

        const redirectUrl =
            this.endpoint +
            '/portal?' +
            buildHttpQuery({ baseEncode, signature });

        return {
            invoiceNo,
            redirectUrl,
            signature,
            time
        };
    }

    /**
     * INQUIRE PAYMENT
     * Call GET & return response data
     */
    async inquirePayment(invoiceNo) {
        if (!invoiceNo) {
            throw new Error('invoiceNo is required');
        }

        const time = getTimestamp();
        const path = `/v2/payments/${invoiceNo}/inquire`;

        const message = [
            'GET',
            this.endpoint + path,
            time
        ].join('\n');

        const signature = buildSignature(message, this.merchantSecret);

        const res = await fetch(this.endpoint + path, {
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

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`NinePay API error ${res.status}: ${text}`);
        }

        return res.json();
    }

    /**
     * Init SDK from ENV
     */
    static fromEnv() {
        return new NinePaySDK({
            merchantKey: process.env.NINEPAY_MERCHANT_KEY,
            merchantSecret: process.env.NINEPAY_MERCHANT_SECRET,
            env: process.env.NINEPAY_ENV || 'sandbox'
        });
    }
}

module.exports = NinePaySDK;
