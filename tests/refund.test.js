const nock = require('nock');
const NinePaySDK = require('../index');

describe('refund', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should refund payment successfully', async () => {
        nock('https://sand-payment.9pay.vn')
            .post('/v2/payments/refund')
            .reply(200, {
                code: '00',
                message: 'Refund success',
                refund_amount: 5000
            });

        const res = await sdk.refund({
            payment_no: 'PAY123456',
            amount: 5000,
            description: 'Refund test'
        });

        expect(res.code).toBe('00');
        expect(res.message).toBe('Refund success');
        expect(res.refund_amount).toBe(5000);
    });

    it('should throw error if missing payment_no', async () => {
        await expect(
            sdk.refund({
                amount: 5000
            })
        ).rejects.toThrow('payment_no is required');
    });
});
