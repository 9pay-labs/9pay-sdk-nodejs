const NinePaySDK = require('../index');

jest.mock('../src/http', () => ({
    request: jest.fn()
}));

const { request } = require('../src/http');

describe('capture', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should capture payment successfully', async () => {
        request.mockResolvedValue({
            code: '00',
            message: 'Capture successful',
            captured_amount: 100000
        });

        const res = await sdk.capture({
            request_id: 'REQ001',
            order_code: 'ORDER001',
            amount: 100000
        });

        expect(res.code).toBe('00');
        expect(res.message).toBe('Capture successful');
        expect(res.captured_amount).toBe(100000);
        expect(request).toHaveBeenCalledWith(
            'https://sand-payment.9pay.vn/v2/payments/capture',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('should throw error if payload is missing', async () => {
        await expect(sdk.capture())
            .rejects.toThrow('payload is required');
    });

    it('should throw error if request_id is missing', async () => {
        await expect(sdk.capture({
            order_code: 'ORDER001',
            amount: 100000
        })).rejects.toThrow('request_id is required');
    });

    it('should throw error if order_code is missing', async () => {
        await expect(sdk.capture({
            request_id: 'REQ001',
            amount: 100000
        })).rejects.toThrow('order_code is required');
    });

    it('should throw error if amount is missing', async () => {
        await expect(sdk.capture({
            request_id: 'REQ001',
            order_code: 'ORDER001'
        })).rejects.toThrow('amount is required');
    });
});
