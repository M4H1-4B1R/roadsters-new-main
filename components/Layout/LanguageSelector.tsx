/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSelector() {
  const [locale, setLocale] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTAPP_LOCALE"))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}`;
    router.refresh();
  };

  return (
    <div className="absolute flex flex-col right-0 mt-2 w-28 bg-white shadow-lg rounded-xl p-3 space-y-2 text-sm">
      <button
        onClick={() => changeLocale("ar")}
        className={`cursor-pointer ${
          locale === "ar" ? "text-black font-medium" : "text-black/50"
        } `}
      >
        العربية
      </button>
      <button
        onClick={() => changeLocale("en")}
        className={`cursor-pointer ${
          locale === "en" ? "text-black font-medium" : "text-black/50"
        } `}
      >
        English
      </button>
    </div>
  );
}
