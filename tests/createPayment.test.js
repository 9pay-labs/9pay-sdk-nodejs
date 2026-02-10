const NinePaySDK = require('../index');

describe('createPayment', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    it('should return redirectUrl and invoiceNo', () => {
        const result = sdk.createPayment({
            amount: 10000,
            description: 'Test payment',
            return_url: 'https://example.com/return'
        });

        expect(result).toHaveProperty('invoiceNo');
        expect(result).toHaveProperty('redirectUrl');
        expect(result.redirectUrl).toContain('https://sand-payment.9pay.vn/portal?');
        expect(result).toHaveProperty('signature');
        expect(result).toHaveProperty('time');
    });

    it('should throw error if missing required fields', () => {
        expect(() =>
            sdk.createPayment({
                amount: 10000
            })
        ).toThrow('amount, description, return_url are required');
    });
});
