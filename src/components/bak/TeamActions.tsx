import React from 'react';
import { Plus } from 'lucide-react';

interface TeamActionsProps {
  onAddTeamMember: () => void;
}

const TeamActions = ({ onAddTeamMember }: TeamActionsProps) => {
  return (
    <button 
      onClick={onAddTeamMember}
      className="w-full h-full bg-transparent border-none text-white hover:bg-orange-600 transition-colors rounded flex items-center justify-center gap-1 font-semibold"
      title="Add team member"
    >
      <Plus className="w-5 h-5" />
    </button>
  );
};

export default TeamActions;