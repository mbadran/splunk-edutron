import React from "react";
import TeamTable from "./TeamTable";
import { Course } from "@/types/types";
import { DEFAULT_TEAM_NAMES } from "@/utils/constants";

interface PlanTeamsProps {
  data: Course[];
  teamMembers: string[];
  selections: Record<string, boolean>;
  onTeamChange: (teamMembers: string[], assignments: Record<string, boolean>) => void;
  onScroll?: (scrollTop: number) => void;
}

const PlanTeams: React.FC<PlanTeamsProps> = ({
  data,
  teamMembers,
  selections,
  onTeamChange,
  onScroll,
}) => {
  // Handle team assignment changes from TeamTable
  const handleTeamAssignmentChange = (
    newTeamMembers: string[],
    newAssignments: Record<string, boolean>
  ) => {
    onTeamChange(newTeamMembers, newAssignments);
  };

  return (
    <div id="plan-teams" className="h-full">
      <TeamTable
        data={data}
        teamMembers={teamMembers}
        onTeamChange={handleTeamAssignmentChange}
        onScroll={onScroll}
        maxMembers={20}
        defaultMemberNames={DEFAULT_TEAM_NAMES}
      />
    </div>
  );
};

PlanTeams.displayName = "PlanTeams";

export default PlanTeams;