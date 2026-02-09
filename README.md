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

const NinePay = require('9pay-nodejs-sdk');

const client = new NinePay({
  merchantKey: process.env.NINEPAY_MERCHANT_KEY,
  merchantSecret: process.env.NINEPAY_MERCHANT_SECRET,
  env: process.env.NINEPAY_ENV || 'sandbox'
});

## Create payment (Redirect user)
const payment = client.createPayment({
  amount: 10000, // VND
  description: 'Order #12345',
  return_url: 'https://your-site.com/return',
  back_url: 'https://your-site.com/back'
});
console.log(payment.redirectUrl);

## Inquire status transaction

const result = await client.inquirePayment('421042322774489');
console.log(result);

## env
NINEPAY_ENV=sandbox
NINEPAY_MERCHANT_KEY=your_key
NINEPAY_MERCHANT_SECRET=your_secret
