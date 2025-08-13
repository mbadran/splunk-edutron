import React, { useState, useCallback } from "react";
import WelcomeScreen from "./WelcomeScreen";
import PlanEditor from "./PlanEditor";

const SplunkEdutron: React.FC = () => {
  const [currentView, setCurrentView] = useState<"welcome" | "edit">("welcome");

  const handleCreatePlan = useCallback(() => {
    setCurrentView("edit");
  }, []);

  const handleLoadPlan = useCallback(() => {
    alert("Coming soon!");
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setCurrentView("welcome");
  }, []);

  if (currentView === "edit") {
    return <PlanEditor onBackToWelcome={handleBackToWelcome} />;
  }

  return (
    <WelcomeScreen
      onCreatePlan={handleCreatePlan}
      onLoadPlan={handleLoadPlan}
    />
  );
};

export default SplunkEdutron;