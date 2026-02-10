const nock = require('nock');
const NinePaySDK = require('../index');

describe('inquirePayment', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should return payment inquiry result', async () => {
        const invoiceNo = 'INV_TEST_001';

        nock('https://sand-payment.9pay.vn')
            .get(`/v2/payments/${invoiceNo}/inquire`)
            .reply(200, {
                status: 'SUCCESS',
                amount: 10000,
                invoice_no: invoiceNo
            });

        const res = await sdk.inquirePayment(invoiceNo);

        expect(res.status).toBe('SUCCESS');
        expect(res.amount).toBe(10000);
        expect(res.invoice_no).toBe(invoiceNo);
    });

    it('should throw error when invoiceNo is missing', async () => {
        await expect(sdk.inquirePayment())
            .rejects
            .toThrow('invoiceNo is required');
    });
});
