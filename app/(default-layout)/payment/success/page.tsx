"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/hooks/useCartStore";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Clear the cart on successful payment
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your order. We&apos;ve received your payment and your order is
                    being processed.
                </p>

                <p className="text-sm text-gray-500 mb-8">
                    You will receive an email confirmation shortly with your order details.
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="w-full bg-[#1E1E1E] text-white py-3 px-6 rounded-xl font-medium hover:bg-black transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}
