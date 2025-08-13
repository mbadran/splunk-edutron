"use client";

import { useEffect } from "react";
import HomePage from "@/components/HomePage";
import { APP_NAME } from "@/utils/constants";

// Force static generation
export const dynamic = "force-static";

export default function Home() {
  // Set page title
  useEffect(() => {
    document.title = `${APP_NAME} - Training Plans for Splunky Teams`;
  }, []);

  return (
    <div id="homepage">
      <HomePage />
    </div>
  );
}