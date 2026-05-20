"use client";

import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                {/* Cancel Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Cancelled
                </h1>
                <p className="text-gray-600 mb-6">
                    Your payment was cancelled. Don&apos;t worry, your order has not been
                    processed and no charges were made.
                </p>

                <p className="text-sm text-gray-500 mb-8">
                    Your cart items are still saved. You can try again when you&apos;re ready.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/checkout")}
                        className="w-full bg-[#1E1E1E] text-white py-3 px-6 rounded-xl font-medium hover:bg-black transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push("/cart")}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        Return to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
