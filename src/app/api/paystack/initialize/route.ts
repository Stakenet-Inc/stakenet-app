import { auth } from "@/lib/auth";
import { initializePayment } from "@/lib/paystack";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { plan, amount } = body;

        if (!plan || !amount) {
            return new NextResponse("Missing plan or amount", { status: 400 });
        }

        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`; // Redirect to dashboard after payment

        // NOTE: We are passing undefined for plan because "PRO" is not a valid Paystack plan code.
        // To enable subscriptions, you must create a plan on Paystack and use its code (e.g., PLN_...) here.
        const paymentResponse = await initializePayment(session.user.email, amount, undefined, callbackUrl);

        return NextResponse.json(paymentResponse.data);
    } catch (error: any) {
        console.error("[PAYSTACK_INITIALIZE]", error);
        return NextResponse.json({ message: error.message || "Internal Error" }, { status: 500 });
    }
}
