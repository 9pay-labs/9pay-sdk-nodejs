const NinePaySDK = require('../index');

jest.mock('../src/http', () => ({
    request: jest.fn()
}));

const { request } = require('../src/http');

describe('refund', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should refund payment successfully', async () => {
        request.mockResolvedValue({
            code: '00',
            message: 'Refund success',
            refund_amount: 5000
        });

        const res = await sdk.refund({
            invoiceNo: 'PAY123456',
            amount: 5000,
            reason: 'Refund test'
        });

        expect(res.code).toBe('00');
        expect(res.message).toBe('Refund success');
        expect(res.refund_amount).toBe(5000);
        expect(request).toHaveBeenCalledWith(
            'https://sand-payment.9pay.vn/v2/payments/refund',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            })
        );
    });

    it('should throw error if missing invoiceNo', async () => {
        await expect(
            sdk.refund({
                amount: 5000
            })
        ).rejects.toThrow('invoiceNo & amount are required');
    });

    it('should throw error if missing amount', async () => {
        await expect(
            sdk.refund({
                invoiceNo: 'PAY123456'
            })
        ).rejects.toThrow('invoiceNo & amount are required');
    });
});
