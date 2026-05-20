import Link from "next/link";
import { Space_Mono } from "next/font/google";

interface FooterColumnProps {
  header: string;
  content: { label: string; href: string }[];
}

const space_mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-Space_Mono",
  weight: ["400", "700"],
});

export default function FooterColumn({ header, content }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <p
        className={`text-[#696969] text-sm sm:text-base ${space_mono.className}`}
      >
        {header}
      </p>

      {/* Links */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {content.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-[#FDF7EF] text-sm sm:text-base hover:underline transition"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
