"use client";

interface ButtonProps {
  label: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  label,
  onClick,
  variant,
  type = "button",
  fullWidth = false,
  disabled = false,
  rounded = true,
  className = "",
}: ButtonProps & { rounded?: boolean }) {
  const baseStyles = `cursor-pointer ${rounded ? "rounded-lg" : ""} text-base px-5 py-2 md:px-8 md:py-3 transition-all duration-300 font-medium`;

  const variantStyles = {
    primary: "text-white bg-black hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:bg-gray-900 active:scale-[0.98] active:shadow-md",
    secondary: "text-[#F7F7F7] bg-[#1E1E1E] hover:bg-[#333333] hover:shadow-md hover:-translate-y-0.5 active:bg-[#000000] active:scale-[0.98]",
    ghost: "text-[#222222] bg-[#F7F7F7] hover:bg-[#e8e8e8] hover:shadow-sm active:bg-[#d9d9d9] active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed hover:shadow-none hover:scale-100" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

