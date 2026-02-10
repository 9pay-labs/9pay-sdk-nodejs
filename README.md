# NinePay NodeJS SDK

## Install
npm install ninepay-sdk

## Config
.env
NINEPAY_MERCHANT_KEY=xxx
NINEPAY_MERCHANT_SECRET=xxx
NINEPAY_ENV=sandbox

## Usage
const NinePaySDK = require('ninepay-sdk');
const ninepay = NinePaySDK.fromEnv();

### Create payment
const pay = ninepay.createPayment({
  amount: 100000,
  description: 'Order #1',
  return_url: 'https://site.com/return'
});

### Inquire
await ninepay.inquirePayment(pay.invoiceNo);

### Refund
await ninepay.refund({
  invoiceNo: pay.invoiceNo,
  amount: 100000,
  reason: 'Customer request'
});

## Test
npm test
