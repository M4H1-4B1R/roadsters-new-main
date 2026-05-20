"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark }: LogoProps) {
  const router = useRouter();

  return (
    <div>
      <Image
        onClick={() => router.push("/")}
        src="/Logo.png"
        alt="Oppa-Shirt"
        width={199}
        height={85}
        className={`${
          dark ? "invert" : ""
        } w-auto cursor-pointer h-12  md:h-16`}
      />
    </div>
  );
}
