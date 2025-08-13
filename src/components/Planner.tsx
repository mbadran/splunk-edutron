import React, { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import Header from "./common/header/Header";
import MonoTable from "./MonoTable";
import { Person } from "@/types/types";
import { DEFAULT_TEAM_NAMES } from "@/utils/constants";
import {
  planStateAtom,
  updatePlanStateAtom,
  plannerCoursesAtom,
  setStatusAtom,
  tableScrollRefAtom,
} from "@/atoms/globalAtoms";
import { useCatalogs } from "@/hooks/shared/useCatalogs";

interface PlannerProps {
  onBackToHome: () => void;
}

const Planner: React.FC<PlannerProps> = ({ onBackToHome }) => {
  // Ensure catalogs are loaded at the Planner level
  const { loading: catalogsLoading } = useCatalogs();

  // Table scroll reference for scroll-to-top functionality
  const tableRef = useRef<{ scrollToOffset: (offset: number) => void }>(null);
  const [, setTableScrollRef] = useAtom(tableScrollRefAtom);

  // Set table reference in global atom for use by action buttons
  useEffect(() => {
    setTableScrollRef(tableRef.current);
  }, [setTableScrollRef]);

  // Jotai state management - pure atoms, no local state
  const [planState] = useAtom(planStateAtom);
  const [, updatePlanState] = useAtom(updatePlanStateAtom);
  const [courses] = useAtom(plannerCoursesAtom);
  const [, setStatus] = useAtom(setStatusAtom);

  // Initialize with default team member if empty
  useEffect(() => {
    if (planState.teamMembers.length === 0) {
      setStatus({ isWorking: true, message: "Initializing team..." });

      const defaultMember: Person = {
        id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: DEFAULT_TEAM_NAMES[0],
        email: "",
        role: "",
        teamId: planState.teams[0] || "team-default",
      };
      updatePlanState({ teamMembers: [defaultMember] });
    }
  }, [
    planState.teamMembers.length,
    planState.teams,
    updatePlanState,
    setStatus,
  ]);

  // Debug logging to track data flow
  useEffect(() => {
    console.log("Planner - courses available:", courses?.length || 0);
    console.log("Planner - team members:", planState.teamMembers?.length || 0);
  }, [
    courses,
    planState.teamMembers,
  ]);

  // Navigation handler
  const handleNavigate = (route: string) => {
    setStatus({ isWorking: true, message: `Navigating to ${route}...` });
    console.log("Navigate to:", route);
    // TODO: Implement navigation logic when routing is added
    setTimeout(() => setStatus({ isWorking: false, message: "" }), 1000);
  };

  return (
    <div id="planner" className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onBackToHome={onBackToHome}
        pageTitle={planState.title}
        currentRoute="/planner"
        onNavigate={handleNavigate}
      />

      {/* MonoTable replaces the dual-table PlanScroller - full height minus header */}
      <div className="flex-1 min-h-0 p-4">
        <div className="h-full">
          <MonoTable ref={tableRef} />
        </div>
      </div>
    </div>
  );
};

export default Planner;