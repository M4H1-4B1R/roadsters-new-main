"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Button from "../Button";

interface SummaryProps {
  subtotal: number;

  promotions: number;
  total: number;
}

export default function Summary({ subtotal, total, promotions }: SummaryProps) {
  const cartTranslations = useTranslations("CartPage");
  const router = useRouter();

  return (
    <div className="w-full sm:max-w-[360px] md:max-w-[400px]">
      <p className="text-[#0A0A0A] font-bold text-base sm:text-lg mb-4 sm:mb-6">
        {cartTranslations("Summary")}
      </p>

      <div className="flex flex-col gap-3 sm:gap-4 text-[#4A5565] text-sm sm:text-base mb-6 sm:mb-8">
        <div className="flex justify-between">
          <p>{cartTranslations("Subtotal")}</p>
          <p>{subtotal} JOD</p>
        </div>

        <div className="flex justify-between">
          <p>{cartTranslations("Delivery")}</p>
          <p>{cartTranslations("OnCheckout")}</p>
        </div>

        <div className="flex justify-between">
          <p>{cartTranslations("Promotions")}</p>
          <p className="text-[#E7000B]">-{promotions.toLocaleString()} JOD</p>
        </div>
      </div>

      <div className="flex mb-6  justify-between text-[#0A0A0A] text-base sm:text-lg">
        <p>{cartTranslations("Total")}</p>
        <p>{total} JOD</p>
      </div>

      <Button
        fullWidth
        label={cartTranslations("proceedToCheckout")}
        variant="primary"
        onClick={() => router.push("/checkout")}
      />
    </div>
  );
}
