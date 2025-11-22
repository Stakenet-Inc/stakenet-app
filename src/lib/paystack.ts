export const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface InitializePaymentResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface VerifyPaymentResponse {
    status: boolean;
    message: string;
    data: {
        status: string;
        reference: string;
        amount: number;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: any;
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone: string;
            metadata: any;
            risk_action: string;
        };
        plan?: {
            id: number;
            name: string;
            plan_code: string;
            description: string;
            amount: number;
            interval: string;
            send_invoices: boolean;
            send_sms: boolean;
            currency: string;
        }
    };
}

export async function initializePayment(email: string, amount: number, plan?: string, callbackUrl?: string) {
    const params: any = {
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        callback_url: callbackUrl,
    };

    if (plan) {
        params.plan = plan;
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize payment');
    }

    return response.json() as Promise<InitializePaymentResponse>;
}

export async function verifyPayment(reference: string) {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify payment');
    }

    return response.json() as Promise<VerifyPaymentResponse>;
}
