import prisma from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-paystack-signature");

        if (!signature) {
            return new NextResponse("No signature", { status: 400 });
        }

        const hash = crypto
            .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest("hex");

        if (hash !== signature) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        const event = JSON.parse(body);

        if (event.event === "charge.success") {
            const { customer, metadata, plan, reference } = event.data;
            const email = customer.email;

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        plan: "PRO", // Assuming only PRO plan for now
                        subscriptionStatus: "active",
                        paystackCustomerCode: customer.customer_code,
                        // paystackSubscriptionCode: plan?.plan_code, // If using subscriptions
                        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    },
                });
            }
        }

        return new NextResponse("Webhook received", { status: 200 });
    } catch (error) {
        console.error("[PAYSTACK_WEBHOOK]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
