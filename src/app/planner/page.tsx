"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Planner from "@/components/Planner";
import { APP_NAME } from "@/utils/constants";

// Force static generation
export const dynamic = "force-static";

export default function PlannerPage() {
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = `Planner - ${APP_NAME}`;
  }, []);

  const handleBackToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div id="planner-page">
      <Planner onBackToHome={handleBackToHome} />
    </div>
  );
}