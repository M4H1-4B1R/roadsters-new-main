"use client";
import ApplicationState from "@/components/ApplicationState";
import { useEffect } from "react";

export default function Loading() {
  // Scroll to top when loading state appears
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return <ApplicationState state="loading" />;
}
