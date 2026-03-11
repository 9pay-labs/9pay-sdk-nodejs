const NinePaySDK = require('../index');

jest.mock('../src/http', () => ({
    request: jest.fn()
}));

const { request } = require('../src/http');

describe('inquirePayment', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return payment inquiry result', async () => {
        const invoiceNo = 'INV_TEST_001';

        request.mockResolvedValue({
            status: 'SUCCESS',
            amount: 10000,
            invoice_no: invoiceNo
        });

        const res = await sdk.inquirePayment(invoiceNo);

        expect(res.status).toBe('SUCCESS');
        expect(res.amount).toBe(10000);
        expect(res.invoice_no).toBe(invoiceNo);
        expect(request).toHaveBeenCalledWith(
            `https://sand-payment.9pay.vn/v2/payments/${invoiceNo}/inquire`,
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Date: expect.any(String),
                    Authorization: expect.stringContaining('Signature')
                })
            })
        );
    });

    it('should throw error when invoiceNo is missing', async () => {
        await expect(sdk.inquirePayment())
            .rejects
            .toThrow('invoiceNo is required');
    });
});
