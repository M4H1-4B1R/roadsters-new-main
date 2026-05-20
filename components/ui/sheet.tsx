"use client";

import * as React from "react";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Sheet({ open, onClose, children, side = "left" }: SheetProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />
      
      {/* Sheet Panel */}
      <div
        className={`
          fixed top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-[320px] max-w-[85vw]
          bg-white z-[101] shadow-2xl transition-transform duration-300 ease-out
          ${
            open
              ? "translate-x-0"
              : side === "left"
              ? "-translate-x-full"
              : "translate-x-full"
          }
        `}
      >
        {children}
      </div>
    </>
  );
}

interface SheetHeaderProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function SheetHeader({ children, onClose }: SheetHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div className="font-display text-xl font-semibold tracking-wide">{children}</div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
}

export function SheetContent({ children }: SheetContentProps) {
  return <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">{children}</div>;
}
