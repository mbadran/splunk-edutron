import React from "react";
import { Edit, Check, X, Trash2 } from "lucide-react";
import { Person } from "@/types/types";
import { TeamMemberManagementHook } from "@/hooks/useTeamMemberManagement";

interface TeamMemberHeaderProps {
  member: Person;
  index: number;
  totalMembers: number;
  managementHook: TeamMemberManagementHook;
}

export const TeamMemberHeader = React.memo<TeamMemberHeaderProps>(
  ({ member, index, totalMembers, managementHook }) => {
    const { 
      editingMember, 
      editValue, 
      setEditValue, 
      startEditing, 
      saveEdit, 
      cancelEdit,
      handleDeleteTeamMember 
    } = managementHook;
    
    const isEditing = editingMember === index;

    if (isEditing) {
      return (
        <div className="flex items-center justify-center gap-1 w-full h-full px-2">
          <input
            id={`team-member-edit-${index}`}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            className="flex-1 h-6 px-1 text-xs text-white bg-transparent rounded border-none outline-none text-center border-b-2 border-dashed border-white/60"
            autoFocus
            maxLength={30}
            onFocus={(e) => e.target.select()}
            aria-label={`Edit team member name: ${member.name}`}
          />
          <div className="flex gap-1">
            <button
              onClick={saveEdit}
              className="text-green-300 hover:text-green-100 p-0.5 rounded"
              title="Save"
              aria-label="Save team member name changes"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-red-300 hover:text-red-100 p-0.5 rounded"
              title="Cancel"
              aria-label="Cancel editing team member name"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between w-full h-full px-2">
        <div
          className="flex-1 text-center cursor-pointer select-none hover:bg-white/20 rounded px-1 py-0.5 transition-colors min-w-0"
          onClick={() => startEditing(index)}
          title={`Edit ${member.name}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              startEditing(index);
            }
          }}
          aria-label={`Team member: ${member.name}. Click to edit.`}
        >
          <span className="text-xs font-semibold block truncate text-white">
            {member.name}
          </span>
        </div>

        <div className="flex gap-0.5 opacity-60 hover:opacity-100 transition-opacity ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startEditing(index);
            }}
            className="p-0.5 hover:bg-white/20 rounded transition-colors text-white"
            title="Edit name"
            aria-label={`Edit ${member.name}'s name`}
          >
            <Edit className="w-3 h-3" />
          </button>

          {totalMembers > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTeamMember(index);
              }}
              className="p-0.5 hover:bg-white/20 hover:text-red-400 rounded transition-colors text-white"
              title="Delete member"
              aria-label={`Delete ${member.name} from team`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

TeamMemberHeader.displayName = "TeamMemberHeader";