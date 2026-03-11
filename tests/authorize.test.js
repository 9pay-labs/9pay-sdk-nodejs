const NinePaySDK = require('../index');

jest.mock('../src/http', () => ({
    request: jest.fn()
}));

const { request } = require('../src/http');

describe('authorize', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should authorize payment successfully', async () => {
        request.mockResolvedValue({
            code: '00',
            message: 'Authorization successful',
            auth_code: 'AUTH123456'
        });

        const res = await sdk.authorize({
            request_id: 'REQ001',
            order_code: 'ORDER001',
            amount: 100000,
            card: {
                number: '4111111111111111',
                holder_name: 'NGUYEN VAN A',
                exp_month: '12',
                exp_year: '2025',
                cvv: '123'
            }
        });

        expect(res.code).toBe('00');
        expect(res.message).toBe('Authorization successful');
        expect(res.auth_code).toBe('AUTH123456');
        expect(request).toHaveBeenCalledWith(
            'https://sand-payment.9pay.vn/v2/payments/authorize',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('should throw error if payload is missing', async () => {
        await expect(sdk.authorize())
            .rejects.toThrow('payload is required');
    });

    it('should throw error if request_id is missing', async () => {
        await expect(sdk.authorize({
            order_code: 'ORDER001',
            amount: 100000,
            card: {}
        })).rejects.toThrow('request_id is required');
    });

    it('should throw error if order_code is missing', async () => {
        await expect(sdk.authorize({
            request_id: 'REQ001',
            amount: 100000,
            card: {}
        })).rejects.toThrow('order_code is required');
    });

    it('should throw error if amount is missing', async () => {
        await expect(sdk.authorize({
            request_id: 'REQ001',
            order_code: 'ORDER001',
            card: {}
        })).rejects.toThrow('amount is required');
    });

    it('should throw error if card is missing', async () => {
        await expect(sdk.authorize({
            request_id: 'REQ001',
            order_code: 'ORDER001',
            amount: 100000
        })).rejects.toThrow('card is required');
    });
});
