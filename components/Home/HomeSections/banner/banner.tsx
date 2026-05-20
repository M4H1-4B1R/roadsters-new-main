"use client";

import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  title?: string;
  linkText?: string;
  linkHref?: string;
  backgroundImage?: string;
}

const DEFAULT_TITLE = "New Drops, Fresh Looks";
const DEFAULT_LINK_TEXT = "Discover More";
const DEFAULT_LINK_HREF = "/categories";

const Banner = ({
  title = DEFAULT_TITLE,
  linkText = DEFAULT_LINK_TEXT,
  linkHref = DEFAULT_LINK_HREF,
  backgroundImage = "/slider1.png",
}: BannerProps) => {
  return (
    <section className="w-full">
      <div
        className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] flex items-center"
        style={{
          backgroundColor: "#6B6B6B",
        }}
      >
        {/* Background Image - positioned to the right */}
        <div className="absolute right-0 top-0 h-full w-[60%] sm:w-[65%] md:w-[70%]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        {/* Content overlay - positioned to the left */}
        <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 max-w-[50%] sm:max-w-[45%] md:max-w-[40%]">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
            {title}
          </h2>
          <Link
            href={linkHref}
            className="text-white text-sm sm:text-base font-normal underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
