"use client";

import { useTranslations } from "next-intl";
import {
  FiHeart,
  FiShoppingCart,
  FiLoader,
  FiAlertTriangle,
} from "react-icons/fi";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApplicationState } from "@/hooks/useApplicationState";

interface ApplicationStateProps {
  state: "loading" | "emptyCart" | "error" | "emptyFavorites" | "noResults";
  onClick?: () => void;
}

export default function ApplicationState({
  state,
  onClick,
}: ApplicationStateProps) {
  const t = useTranslations("ApplicationState");
  const router = useRouter();
  const handleClick = onClick ?? (() => router.refresh());

  const { setIsNavSolid } = useApplicationState();

  // Make navbar solid for the entire duration of this screen

  useEffect(() => {
    setIsNavSolid(true);
    return () => setIsNavSolid(false);
  }, [setIsNavSolid]);

  const renderIcon = () => {
    switch (state) {
      case "loading":
        return <FiLoader className="animate-spin text-gray-500" size={40} />;
      case "emptyCart":
        return <FiShoppingCart className="text-gray-400" size={40} />;
      case "emptyFavorites":
        return <FiHeart className="text-gray-400" size={40} />;
      case "error":
        return <FiAlertTriangle className="text-red-500" size={40} />;
      case "noResults":
        return <FiAlertTriangle className="text-gray-400" size={40} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen  text-center px-6">
      <div className="mb-4">{renderIcon()}</div>
      <h2 className="text-xl font-semibold mb-1">{t(`${state}.title`)}</h2>
      <p className="text-gray-600 max-w-sm mb-4">{t(`${state}.message`)}</p>
      <Button
        onClick={handleClick}
        variant="secondary"
        label={t(`${state}.button`) || t("defaultButton")}
      />
    </div>
  );
}
