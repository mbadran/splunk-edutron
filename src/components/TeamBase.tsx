import React from "react";
import { useAtom } from "jotai";
import { atom } from "jotai";
import { Person } from "@/types/types";
import { setStatusAtom } from "@/atoms/globalAtoms";
import { DEFAULT_TEAM_NAMES } from "@/utils/constants";

// Shared atoms for team state
export const teamDataAtom = atom<Person[]>([]);
export const teamErrorAtom = atom<Error | null>(null);

interface TeamBaseProps {
  children: (data: {
    teamMembers: Person[];
    error: Error | null;
    addMember: (name: string) => void;
    updateMember: (id: string, updates: Partial<Person>) => void;
    deleteMember: (id: string) => void;
    clearError: () => void;
    initializeWithDefaults: () => void;
  }) => React.ReactNode;
}

const TeamBase: React.FC<TeamBaseProps> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useAtom(teamDataAtom);
  const [error, setError] = useAtom(teamErrorAtom);
  const [, setWorking] = useAtom(setStatusAtom);

  const generateMemberId = (): string => {
    return `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMember = (name: string) => {
    if (!name.trim()) {
      setError(new Error("Name cannot be empty"));
      return;
    }

    setWorking({ isWorking: true, message: "Adding team member" });
    setError(null);

    try {
      const newMember: Person = {
        id: generateMemberId(),
        name: name.trim(),
        email: "",
        role: "",
      };

      const updatedMembers = [...teamMembers, newMember];
      setTeamMembers(updatedMembers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Failed to add team member");
      setError(errorMessage);
      console.error("Error adding team member:", errorMessage);
    } finally {
      setWorking({ isWorking: false, message: "" });
    }
  };

  const updateMember = (id: string, updates: Partial<Person>) => {
    setWorking({ isWorking: true, message: "Updating team member" });
    setError(null);

    try {
      const updatedMembers = teamMembers.map((member) =>
        member.id === id ? { ...member, ...updates } : member,
      );

      setTeamMembers(updatedMembers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Failed to update team member");
      setError(errorMessage);
      console.error("Error updating team member:", errorMessage);
    } finally {
      setWorking({ isWorking: false, message: "" });
    }
  };

  const deleteMember = (id: string) => {
    setWorking({ isWorking: true, message: "Deleting team member" });
    setError(null);

    try {
      const updatedMembers = teamMembers.filter((member) => member.id !== id);
      setTeamMembers(updatedMembers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Failed to delete team member");
      setError(errorMessage);
      console.error("Error deleting team member:", errorMessage);
    } finally {
      setWorking({ isWorking: false, message: "" });
    }
  };

  const clearError = () => {
    setError(null);
  };

  const initializeWithDefaults = () => {
    setWorking({
      isWorking: true,
      message: "Initializing team with default members",
    });
    setError(null);

    try {
      const defaultMembers: Person[] = DEFAULT_TEAM_NAMES.slice(0, 10).map(
        (name) => ({
          id: generateMemberId(),
          name,
          email: "",
          role: "",
        }),
      );

      setTeamMembers(defaultMembers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Failed to initialize team");
      setError(errorMessage);
      console.error("Error initializing team:", errorMessage);
    } finally {
      setWorking({ isWorking: false, message: "" });
    }
  };

  return (
    <>
      {children({
        teamMembers,
        error,
        addMember,
        updateMember,
        deleteMember,
        clearError,
        initializeWithDefaults,
      })}
    </>
  );
};

export default TeamBase;