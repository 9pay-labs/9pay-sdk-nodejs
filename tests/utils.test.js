const {
    getTimestamp,
    generateInvoiceNo,
    buildHttpQuery,
    buildSignature
} = require('../src/utils');

describe('utils', () => {
    describe('getTimestamp', () => {
        it('should return a valid UTC string', () => {
            const timestamp = getTimestamp();
            expect(typeof timestamp).toBe('string');
            expect(timestamp).toMatch(/GMT$/);
        });

        it('should return current time', () => {
            const before = new Date();
            const timestamp = getTimestamp();
            const after = new Date();

            const parsed = new Date(timestamp);
            expect(parsed.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
            expect(parsed.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
        });
    });

    describe('generateInvoiceNo', () => {
        it('should generate 16-character hex string by default', () => {
            const invoiceNo = generateInvoiceNo();
            expect(invoiceNo).toHaveLength(16);
            expect(invoiceNo).toMatch(/^[0-9A-F]+$/);
        });

        it('should generate hex string with custom length', () => {
            const invoiceNo = generateInvoiceNo(4);
            expect(invoiceNo).toHaveLength(8);
            expect(invoiceNo).toMatch(/^[0-9A-F]+$/);
        });

        it('should generate unique values', () => {
            const invoices = new Set();
            for (let i = 0; i < 100; i++) {
                invoices.add(generateInvoiceNo());
            }
            expect(invoices.size).toBe(100);
        });
    });

    describe('buildHttpQuery', () => {
        it('should build query string from object', () => {
            const query = buildHttpQuery({
                amount: 10000,
                description: 'Test'
            });
            expect(query).toBe('amount=10000&description=Test');
        });

        it('should sort keys alphabetically', () => {
            const query = buildHttpQuery({
                zebra: 'last',
                apple: 'first',
                mango: 'middle'
            });
            expect(query).toBe('apple=first&mango=middle&zebra=last');
        });

        it('should exclude null and undefined values', () => {
            const query = buildHttpQuery({
                valid: 'yes',
                nullable: null,
                undef: undefined
            });
            expect(query).toBe('valid=yes');
        });

        it('should handle empty object', () => {
            const query = buildHttpQuery({});
            expect(query).toBe('');
        });

        it('should encode special characters', () => {
            const query = buildHttpQuery({
                url: 'https://example.com?foo=bar'
            });
            expect(query).toContain('url=');
            expect(query).toContain('%3A');
        });
    });

    describe('buildSignature', () => {
        it('should generate HMAC-SHA256 signature', () => {
            const signature = buildSignature('test message', 'secret');
            expect(signature).toHaveLength(64);
            expect(signature).toMatch(/^[0-9a-f]+$/);
        });

        it('should generate consistent signatures for same input', () => {
            const sig1 = buildSignature('same message', 'same secret');
            const sig2 = buildSignature('same message', 'same secret');
            expect(sig1).toBe(sig2);
        });

        it('should generate different signatures for different messages', () => {
            const sig1 = buildSignature('message 1', 'secret');
            const sig2 = buildSignature('message 2', 'secret');
            expect(sig1).not.toBe(sig2);
        });

        it('should generate different signatures for different secrets', () => {
            const sig1 = buildSignature('same message', 'secret1');
            const sig2 = buildSignature('same message', 'secret2');
            expect(sig1).not.toBe(sig2);
        });
    });
});
