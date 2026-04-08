# NinePay Node.js SDK

Official 9PAY Payment SDK for Node.js applications. Easily integrate payment processing, inquiries, refunds, and card operations.

[![npm version](https://img.shields.io/npm/v/ninepay-sdk.svg)](https://www.npmjs.com/package/ninepay-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

## Features

- Create payment and redirect to 9PAY portal
- Inquire payment status
- Process refunds
- Card Direct API (Payer Authentication, Authorize, Capture)
- TypeScript support

## Installation

```bash
npm install ninepay-sdk
```

## Quick Start

```javascript
const NinePaySDK = require('ninepay-sdk');

// Initialize from environment variables
const ninepay = NinePaySDK.fromEnv();

// Or initialize with config
const ninepay = new NinePaySDK({
    merchantKey: 'your_merchant_key',
    merchantSecret: 'your_merchant_secret',
    endpoint: '9pay_domain'
});

// Create a payment
const payment = ninepay.createPayment({
    amount: 100000,
    description: 'Order #1234',
    return_url: 'https://yoursite.com/payment/return'
});

console.log(payment.redirectUrl); // Redirect user to this URL
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
NINEPAY_MERCHANT_KEY=your_merchant_key
NINEPAY_MERCHANT_SECRET=your_merchant_secret
NINEPAY_ENDPOINT=9pay_domain
```

### Constructor Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `merchantKey` | string | Yes | - | Merchant key from 9PAY |
| `merchantSecret` | string | Yes | - | Merchant secret from 9PAY |
| `endpoint` | string | No | - | 9pay API endpoint  |

## API Reference

### createPayment(params)

Create a new payment and get redirect URL.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | number | Yes | Payment amount in VND |
| `description` | string | Yes | Payment description |
| `return_url` | string | Yes | URL to redirect after payment |
| `back_url` | string | No | URL for back button (defaults to return_url) |
| `invoice_no` | string | No | Custom invoice number (auto-generated if not provided) |

**Returns:**

```javascript
{
    invoiceNo: string,    // Invoice number
    redirectUrl: string,  // Redirect URL for payment
    signature: string,    // Request signature
    time: string          // Request timestamp
}
```

**Example:**

```javascript
const result = ninepay.createPayment({
    amount: 150000,
    description: 'Premium subscription',
    return_url: 'https://yoursite.com/return',
    back_url: 'https://yoursite.com/cart'
});

// Redirect user to payment page
res.redirect(result.redirectUrl);
```

---

### inquirePayment(invoiceNo)

Check the status of a payment.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `invoiceNo` | string | Yes | Invoice number to inquire |

**Returns:** `Promise<Object>` - Payment status and details

**Example:**

```javascript
const status = await ninepay.inquirePayment('INV123456');
console.log(status);
// { status: 'SUCCESS', amount: 150000, invoice_no: 'INV123456', ... }
```

---

### refund(params)

Process a refund for a payment.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `invoiceNo` | string | Yes | Invoice number to refund |
| `amount` | number | Yes | Refund amount in VND |
| `reason` | string | No | Reason for refund |

**Returns:** `Promise<Object>` - Refund response

**Example:**

```javascript
const refund = await ninepay.refund({
    invoiceNo: 'INV123456',
    amount: 50000,
    reason: 'Customer request'
});

if (refund.code === '00') {
    console.log('Refund successful:', refund.refund_amount);
}
```

---

### payerAuth(payload)

Authenticate payer for Card Direct API (CIT/MIT).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `request_id` | string | Yes | Unique request identifier |
| `amount` | number | Yes | Payment amount in VND |
| `card` | object | Yes | Card information |

**Card Object:**

```javascript
{
    number: '4111111111111111',
    holder_name: 'NGUYEN VAN A',
    exp_month: '12',
    exp_year: '2025',
    cvv: '123'
}
```

**Example:**

```javascript
const auth = await ninepay.payerAuth({
    request_id: 'REQ_001',
    amount: 100000,
    card: {
        number: '4111111111111111',
        holder_name: 'NGUYEN VAN A',
        exp_month: '12',
        exp_year: '2025',
        cvv: '123'
    }
});
```

---

### authorize(payload)

Pre-authorize a card payment.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `request_id` | string | Yes | Unique request identifier |
| `order_code` | string | Yes | Order code |
| `amount` | number | Yes | Amount to authorize |
| `card` | object | Yes | Card information |

**Example:**

```javascript
const auth = await ninepay.authorize({
    request_id: 'REQ_001',
    order_code: 'ORDER_001',
    amount: 200000,
    card: {
        number: '4111111111111111',
        holder_name: 'NGUYEN VAN A',
        exp_month: '12',
        exp_year: '2025',
        cvv: '123'
    }
});
```

---

### capture(payload)

Capture a pre-authorized payment.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `request_id` | string | Yes | Unique request identifier |
| `order_code` | string | Yes | Order code |
| `amount` | number | Yes | Amount to capture |

**Example:**

```javascript
const capture = await ninepay.capture({
    request_id: 'REQ_001',
    order_code: 'ORDER_001',
    amount: 200000
});

if (capture.code === '00') {
    console.log('Payment captured successfully');
}
```

---

### NinePaySDK.fromEnv()

Create SDK instance from environment variables.

**Example:**

```javascript
// Reads NINEPAY_MERCHANT_KEY, NINEPAY_MERCHANT_SECRET, NINEPAY_ENDPOINT
const ninepay = NinePaySDK.fromEnv();
```

## Error Handling

The SDK throws errors for validation failures and HTTP errors.

```javascript
try {
    const payment = ninepay.createPayment({
        amount: 100000
        // missing required fields
    });
} catch (error) {
    console.error(error.message);
    // "amount, description, return_url are required"
}

try {
    const status = await ninepay.inquirePayment('INVALID_INV');
} catch (error) {
    if (error.message.startsWith('HTTP')) {
        // API error: "HTTP 404: Not found"
    }
}
```

## TypeScript Support

The SDK includes TypeScript definitions.

```typescript
import NinePaySDK, {
    NinePayConfig,
    CreatePaymentParams,
    CreatePaymentResult,
    RefundParams
} from 'ninepay-sdk';

const config: NinePayConfig = {
    merchantKey: 'your_key',
    merchantSecret: 'your_secret',
    endpoint: '9pay_domain'
};

const ninepay = new NinePaySDK(config);

const params: CreatePaymentParams = {
    amount: 100000,
    description: 'Test payment',
    return_url: 'https://example.com/return'
};

const result: CreatePaymentResult = ninepay.createPayment(params);
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Testing Without Publishing to npm

You can test the SDK locally before publishing:

### Using npm link

```bash
# In SDK directory
npm link

# In your test project
npm link ninepay-sdk
```

### Using local path

```bash
# In your test project
npm install /path/to/9pay-sdk-nodejs
```

### Using npm pack

```bash
# In SDK directory
npm pack
# Creates ninepay-sdk-1.0.0.tgz

# In your test project
npm install /path/to/ninepay-sdk-1.0.0.tgz
```

## Requirements

- Node.js >= 18

## License

MIT
