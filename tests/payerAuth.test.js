const NinePaySDK = require('../index');

jest.mock('../src/http', () => ({
    request: jest.fn()
}));

const { request } = require('../src/http');

describe('payerAuth', () => {
    const sdk = new NinePaySDK({
        merchantKey: 'test_key',
        merchantSecret: 'test_secret',
        env: 'sandbox'
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should authenticate payer successfully', async () => {
        request.mockResolvedValue({
            code: '00',
            message: 'Success',
            transaction_id: 'TXN123456'
        });

        const res = await sdk.payerAuth({
            request_id: 'REQ001',
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
        expect(res.message).toBe('Success');
        expect(res.transaction_id).toBe('TXN123456');
        expect(request).toHaveBeenCalledWith(
            'https://sand-payment.9pay.vn/v2/payments/payer-auth',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('should throw error if payload is missing', async () => {
        await expect(sdk.payerAuth())
            .rejects.toThrow('payload is required');
    });

    it('should throw error if request_id is missing', async () => {
        await expect(sdk.payerAuth({
            amount: 100000,
            card: {}
        })).rejects.toThrow('request_id is required');
    });

    it('should throw error if amount is missing', async () => {
        await expect(sdk.payerAuth({
            request_id: 'REQ001',
            card: {}
        })).rejects.toThrow('amount is required');
    });

    it('should throw error if card is missing', async () => {
        await expect(sdk.payerAuth({
            request_id: 'REQ001',
            amount: 100000
        })).rejects.toThrow('card is required');
    });
});
