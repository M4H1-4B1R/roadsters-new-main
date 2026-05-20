"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaArrowRight } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const navLinks = [
    { number: "01", label: "HOME", href: "/" },
    { number: "02", label: "CATEGORIES", href: "/categories" },
    { number: "03", label: "PRODUCTS", href: "/products" },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: "https://www.instagram.com/roadsters.jo?igsh=NGYyNTlnemtrY2Uz" },
  ];

  const handleNewsletterSubmit = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: "Newsletter Subscriber",
          email: email,
        }),
      });

      if (response.ok) {
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="footer" className="bg-[#424242] text-white">
      {/* Main Footer Content */}
      <div className="px-6 sm:px-10 md:px-16 lg:px-20 pt-12 pb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">

          {/* Left Section */}
          <div className="flex flex-col gap-8 lg:w-1/2">
            {/* Logo */}
            <Link href="/">
              <h1 className="text-4xl font-bold">
                Roadsters
              </h1>
            </Link>

            {/* Newsletter Section */}
            <div className="flex flex-col gap-2">
              <p className="text-white text-lg font-medium">Keep up with us.</p>
              <p className="text-gray-400 text-sm">
                Get news, photos, events, and business updates
              </p>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 max-w-[280px] px-4 py-3 bg-white text-gray-800 placeholder-gray-500 text-sm rounded-l-none border-0 focus:outline-none"
                  placeholder="Email Address..."
                />
                <button
                  onClick={handleNewsletterSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-3 bg-[#1E1E1E] text-white text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "Sign Up"}
                </button>
              </div>
              {message && (
                <p className={`text-xs ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Contact Us Link */}
            <Link
              href="/contact"
              className="flex items-center gap-2 text-white text-sm hover:text-gray-300 transition-colors w-fit"
            >
              Contact Us
              <FaArrowRight className="w-3 h-3 -rotate-45" />
            </Link>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex flex-col gap-8 lg:items-start">
            {navLinks.map((link) => (
              <Link
                key={link.number}
                href={link.href}
                className="flex items-center gap-4 group"
              >
                <span className="text-gray-400 text-sm">{link.number}</span>
                <span className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold group-hover:text-gray-300 transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© Roadsters {new Date().getFullYear()} - All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/terms" className="hover:text-white transition-colors underline underline-offset-2">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors underline underline-offset-2">
                Privacy Policy
              </Link>
              <a
                href="https://clicksdigitals.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                Powered by Clicks Digitals
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
