/**
 * 9PAY Node.js SDK TypeScript Definitions
 */

export interface NinePayConfig {
    /** Merchant key provided by 9PAY */
    merchantKey: string;
    /** Merchant secret provided by 9PAY */
    merchantSecret: string;
    /** Environment: 'sandbox' or 'production' */
    env?: 'sandbox' | 'production';
    /** Custom endpoint URL (overrides env setting) */
    endpoint?: string;
}

export interface CreatePaymentParams {
    /** Payment amount in VND */
    amount: number;
    /** Payment description */
    description: string;
    /** URL to redirect after payment completion */
    return_url: string;
    /** URL for back button (defaults to return_url) */
    back_url?: string;
    /** Custom invoice number (auto-generated if not provided) */
    invoice_no?: string;
}

export interface CreatePaymentResult {
    /** Generated or provided invoice number */
    invoiceNo: string;
    /** URL to redirect user for payment */
    redirectUrl: string;
    /** Request signature */
    signature: string;
    /** Timestamp of the request */
    time: string;
}

export interface RefundParams {
    /** Invoice number of the payment to refund */
    invoiceNo: string;
    /** Refund amount in VND */
    amount: number;
    /** Reason for refund */
    reason?: string;
}

export interface CardInfo {
    /** Card number */
    number: string;
    /** Cardholder name */
    holder_name: string;
    /** Expiration month (MM) */
    exp_month: string;
    /** Expiration year (YYYY) */
    exp_year: string;
    /** Card verification value */
    cvv: string;
}

export interface PayerAuthPayload {
    /** Unique request identifier */
    request_id: string;
    /** Payment amount in VND */
    amount: number;
    /** Card information */
    card: CardInfo;
    /** Additional fields as needed */
    [key: string]: unknown;
}

export interface AuthorizePayload {
    /** Unique request identifier */
    request_id: string;
    /** Order code */
    order_code: string;
    /** Payment amount in VND */
    amount: number;
    /** Card information */
    card: CardInfo;
    /** Additional fields as needed */
    [key: string]: unknown;
}

export interface CapturePayload {
    /** Unique request identifier */
    request_id: string;
    /** Order code */
    order_code: string;
    /** Amount to capture in VND */
    amount: number;
    /** Additional fields as needed */
    [key: string]: unknown;
}

export interface ApiResponse {
    /** Response code ('00' for success) */
    code: string;
    /** Response message */
    message: string;
    /** Additional response fields */
    [key: string]: unknown;
}

export interface InquireResponse extends ApiResponse {
    /** Payment status */
    status: string;
    /** Payment amount */
    amount: number;
    /** Invoice number */
    invoice_no: string;
}

export interface RefundResponse extends ApiResponse {
    /** Refunded amount */
    refund_amount: number;
}

declare class NinePaySDK {
    /** Merchant key */
    readonly merchantKey: string;
    /** Merchant secret */
    readonly merchantSecret: string;
    /** API endpoint URL */
    readonly endpoint: string;

    /**
     * Create a new NinePaySDK instance
     * @param config SDK configuration
     */
    constructor(config: NinePayConfig);

    /**
     * Create a payment and get redirect URL
     * @param params Payment parameters
     * @returns Payment result with redirect URL
     */
    createPayment(params: CreatePaymentParams): CreatePaymentResult;

    /**
     * Inquire payment status
     * @param invoiceNo Invoice number to inquire
     * @returns Payment status and details
     */
    inquirePayment(invoiceNo: string): Promise<InquireResponse>;

    /**
     * Refund a payment
     * @param params Refund parameters
     * @returns Refund response
     */
    refund(params: RefundParams): Promise<RefundResponse>;

    /**
     * Authenticate payer (CIT/MIT - Card Direct API)
     * @param payload Payer authentication payload
     * @returns API response
     */
    payerAuth(payload: PayerAuthPayload): Promise<ApiResponse>;

    /**
     * Authorize a pre-auth payment
     * @param payload Authorization payload
     * @returns API response
     */
    authorize(payload: AuthorizePayload): Promise<ApiResponse>;

    /**
     * Capture a pre-authorized payment
     * @param payload Capture payload
     * @returns API response
     */
    capture(payload: CapturePayload): Promise<ApiResponse>;

    /**
     * Create SDK instance from environment variables
     * Reads: NINEPAY_MERCHANT_KEY, NINEPAY_MERCHANT_SECRET, NINEPAY_ENV
     * @returns NinePaySDK instance
     */
    static fromEnv(): NinePaySDK;
}

export = NinePaySDK;
