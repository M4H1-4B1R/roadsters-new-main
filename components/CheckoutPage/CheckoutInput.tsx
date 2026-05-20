"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { IconType } from "react-icons";

interface CheckoutInputProps {
  id: string;
  icon: IconType;
  placeholder: string;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
}

export default function CheckoutInput({
  id,
  icon: Icon,
  placeholder,
  registration,
  error,
}: CheckoutInputProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        {/* Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400 text-base sm:text-lg" />
        </div>

        {/* Input */}
        <input
          id={id}
          {...registration}
          type="text"
          placeholder={placeholder}
          className={`
            w-full rounded-xl transition-all duration-200
            pl-10 pr-4 
            py-2 text-sm                 /* mobile */
            sm:py-3 sm:text-base         /* tablet+ */
            border bg-white
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-200 focus:border-black focus:ring-2 focus:ring-[#C9E2FF]"
            }
          `}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
