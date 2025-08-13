import { useAtom } from "jotai";
import { useCallback } from "react";
import { Person } from "@/types/types";
import { DEFAULT_TEAM_NAMES } from "@/utils/constants";
import {
  planStateAtom,
  editingTeamMemberAtom,
  editingTeamMemberValueAtom,
  addTeamMemberAtom,
  updateTeamMemberAtom,
  deleteTeamMemberAtom,
  setStatusAtom,
} from "@/atoms/globalAtoms";

const MAX_TEAM_MEMBERS = 20;

export interface TeamMemberManagementHook {
  editingMember: number | null;
  editValue: string;
  setEditingMember: (index: number | null) => void;
  setEditValue: (value: string) => void;
  handleAddTeamMember: () => void;
  handleDeleteTeamMember: (index: number) => void;
  handleUpdateTeamMember: (index: number, newName: string) => void;
  startEditing: (index: number) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
}

/**
 * Custom hook for managing team member operations
 */
export const useTeamMemberManagement = (): TeamMemberManagementHook => {
  const [planState] = useAtom(planStateAtom);
  const [editingMember, setEditingMember] = useAtom(editingTeamMemberAtom);
  const [editValue, setEditValue] = useAtom(editingTeamMemberValueAtom);
  const [, addTeamMember] = useAtom(addTeamMemberAtom);
  const [, updateTeamMember] = useAtom(updateTeamMemberAtom);
  const [, deleteTeamMember] = useAtom(deleteTeamMemberAtom);
  const [, setStatus] = useAtom(setStatusAtom);

  const handleAddTeamMember = useCallback(() => {
    if (planState.teamMembers.length >= MAX_TEAM_MEMBERS) {
      setStatus({ isWorking: false, message: `Maximum ${MAX_TEAM_MEMBERS} members allowed` });
      return;
    }

    setStatus({ isWorking: true, message: "Adding team member..." });
    
    // FIXED: Call addTeamMember() directly - it will create the member with proper defaults
    addTeamMember();
  }, [planState.teamMembers.length, addTeamMember, setStatus]);

  const handleDeleteTeamMember = useCallback((index: number) => {
    if (planState.teamMembers.length <= 1) {
      setStatus({ isWorking: false, message: "Cannot delete the last team member" });
      return;
    }

    setStatus({ isWorking: true, message: "Removing team member..." });
    deleteTeamMember(index);
  }, [planState.teamMembers.length, deleteTeamMember, setStatus]);

  const handleUpdateTeamMember = useCallback((index: number, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setStatus({ isWorking: false, message: "Team member name cannot be empty" });
      return;
    }

    if (
      planState.teamMembers.some(
        (member, i) =>
          i !== index &&
          member.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setStatus({ isWorking: false, message: "Team member name already exists" });
      return;
    }

    setStatus({ isWorking: true, message: "Updating team member..." });
    updateTeamMember({ 
      index, 
      updates: { name: trimmedName }
    });
  }, [planState.teamMembers, updateTeamMember, setStatus]);

  const startEditing = useCallback((index: number) => {
    setEditingMember(index);
    setEditValue(planState.teamMembers[index]?.name || "");
  }, [setEditingMember, setEditValue, planState.teamMembers]);

  const saveEdit = useCallback(() => {
    if (editValue.trim() && editingMember !== null) {
      handleUpdateTeamMember(editingMember, editValue.trim());
    } else {
      setEditingMember(null);
      setEditValue("");
    }
  }, [editValue, editingMember, handleUpdateTeamMember, setEditingMember, setEditValue]);

  const cancelEdit = useCallback(() => {
    setEditingMember(null);
    setEditValue("");
  }, [setEditingMember, setEditValue]);

  return {
    editingMember,
    editValue,
    setEditingMember,
    setEditValue,
    handleAddTeamMember,
    handleDeleteTeamMember,
    handleUpdateTeamMember,
    startEditing,
    saveEdit,
    cancelEdit,
  };
};