# 9pay-sdk-nodejs

Node.js SDK for 9Pay Payment Gateway.

## Features
- Create payment redirect URL
- Inquire transaction status
- HMAC SHA256 signature
- Sandbox / Production support

## Install
```bash
npm install 9pay-nodejs-sdk

## Configuration

const NinePaySDK = require('./index');

const client = new NinePaySDK({
    merchantKey: 'juAOxL',
    merchantSecret: '3Je7RxfgIzbgbTyUX6uIa2FzhcQv1apHdap',
    endpoint: 'https://sand-payment.9pay.vn'
});

// 1️⃣ Create payment
const payment = client.createPayment({
    amount: 10000,
    description: 'This is description',
    return_url: 'https://example.com/return'
});

console.log(payment.redirectUrl);

// 2️⃣ Inquire payment
const result = await client.inquirePayment('TS3102_83916273_55129');
console.log(result);

## env
NINEPAY_ENV=sandbox
NINEPAY_MERCHANT_KEY=your_key
NINEPAY_MERCHANT_SECRET=your_secret
