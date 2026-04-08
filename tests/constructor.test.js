const NinePaySDK = require('../index');

describe('NinePaySDK constructor', () => {
    it('should create instance with valid config', () => {

        const sdk = new NinePaySDK({
            merchantKey: 'test_key',
            merchantSecret: 'test_secret',
            env: 'sandbox'
        });

        expect(sdk.merchantKey).toBe('test_key');
        expect(sdk.merchantSecret).toBe('test_secret');
        expect(sdk.endpoint).toBe('https://sand-payment.9pay.vn');
    });

    it('should use production endpoint when env is production', () => {
        const sdk = new NinePaySDK({
            merchantKey: 'test_key',
            merchantSecret: 'test_secret',
            env: 'production'
        });

        expect(sdk.endpoint).toBe('https://payment.9pay.vn');
    });

    it('should use custom endpoint when provided', () => {
        const sdk = new NinePaySDK({
            merchantKey: 'test_key',
            merchantSecret: 'test_secret',
            endpoint: 'https://custom.9pay.vn'
        });

        expect(sdk.endpoint).toBe('https://custom.9pay.vn');
    });

    it('should default to sandbox when env is not specified', () => {
        const sdk = new NinePaySDK({
            merchantKey: 'test_key',
            merchantSecret: 'test_secret'
        });

        expect(sdk.endpoint).toBe('https://sand-payment.9pay.vn');
    });

    it('should throw error if merchantKey is missing', () => {
        expect(() => new NinePaySDK({
            merchantSecret: 'test_secret'
        })).toThrow('merchantKey & merchantSecret are required');
    });

    it('should throw error if merchantSecret is missing', () => {
        expect(() => new NinePaySDK({
            merchantKey: 'test_key'
        })).toThrow('merchantKey & merchantSecret are required');
    });

    it('should throw error if both merchantKey and merchantSecret are missing', () => {
        expect(() => new NinePaySDK({}))
            .toThrow('merchantKey & merchantSecret are required');
    });

    it('should throw error for invalid env', () => {
        expect(() => new NinePaySDK({
            merchantKey: 'test_key',
            merchantSecret: 'test_secret',
            env: 'invalid'
        })).toThrow('Invalid env');
    });
});

describe('NinePaySDK.fromEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should create instance from environment variables', () => {
        process.env.NINEPAY_MERCHANT_KEY = 'env_key';
        process.env.NINEPAY_MERCHANT_SECRET = 'env_secret';
        process.env.NINEPAY_ENV = 'production';

        const sdk = NinePaySDK.fromEnv();

        expect(sdk.merchantKey).toBe('env_key');
        expect(sdk.merchantSecret).toBe('env_secret');
        expect(sdk.endpoint).toBe('https://payment.9pay.vn');
    });

    it('should default to sandbox when NINEPAY_ENV is not set', () => {
        process.env.NINEPAY_MERCHANT_KEY = 'env_key';
        process.env.NINEPAY_MERCHANT_SECRET = 'env_secret';
        delete process.env.NINEPAY_ENV;

        const sdk = NinePaySDK.fromEnv();

        expect(sdk.endpoint).toBe('https://sand-payment.9pay.vn');
    });
});
