import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Layout/NavBar";
import Footer from "@/components/Layout/Footer/Footer";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: {
    default: "Roadsters",
    template: "%s | Roadsters",
  },
  description:
    "Roadsters is your go-to destination for premium clothes, trendy apparel, and everyday fashion essentials. Discover high-quality styles designed for comfort, confidence, and modern living.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
