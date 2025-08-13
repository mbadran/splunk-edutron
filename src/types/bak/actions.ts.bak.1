import { Person } from "./types";

// Base action interface
export interface BaseAction {
  type: string;
  timestamp: string;
  id: string; // Unique ID for each action
}

// Action payload interfaces
export interface AddTeamMemberAction extends BaseAction {
  type: "ADD_TEAM_MEMBER";
  payload: {
    member: Person;
    index: number; // Where it was added
  };
}

export interface RemoveTeamMemberAction extends BaseAction {
  type: "REMOVE_TEAM_MEMBER";
  payload: {
    member: Person; // The removed member
    index: number; // Where it was removed from
    selections: Record<string, Record<string, string[]>>; // Any selections that were removed
  };
}

export interface UpdateTeamMemberAction extends BaseAction {
  type: "UPDATE_TEAM_MEMBER";
  payload: {
    index: number;
    oldMember: Person;
    newMember: Person;
  };
}

export interface ToggleCourseSelectionAction extends BaseAction {
  type: "TOGGLE_COURSE_SELECTION";
  payload: {
    personId: string;
    catalogId: string;
    courseId: string;
    wasSelected: boolean; // true if it was selected before toggle
  };
}

export interface UpdateTitleAction extends BaseAction {
  type: "UPDATE_TITLE";
  payload: {
    oldTitle: string;
    newTitle: string;
  };
}

export interface UpdateNotesAction extends BaseAction {
  type: "UPDATE_NOTES";
  payload: {
    oldNotes: string;
    newNotes: string;
  };
}

export interface SetBudgetAction extends BaseAction {
  type: "SET_BUDGET";
  payload: {
    oldBudget: number | null;
    newBudget: number | null;
  };
}

export interface ResetSelectionsAction extends BaseAction {
  type: "RESET_SELECTIONS";
  payload: {
    oldSelections: Record<string, Record<string, string[]>>;
  };
}

export interface ImportPlanAction extends BaseAction {
  type: "IMPORT_PLAN";
  payload: {
    oldPlanState: any; // Full previous plan state
    newPlanState: any; // Full new plan state
  };
}

export interface ToggleCreditsModeAction extends BaseAction {
  type: "TOGGLE_CREDITS_MODE";
  payload: {
    oldMode: boolean;
    newMode: boolean;
  };
}

// Union type of all actions
export type PlanAction = 
  | AddTeamMemberAction
  | RemoveTeamMemberAction
  | UpdateTeamMemberAction
  | ToggleCourseSelectionAction
  | UpdateTitleAction
  | UpdateNotesAction
  | SetBudgetAction
  | ResetSelectionsAction
  | ImportPlanAction
  | ToggleCreditsModeAction;

// History state interface
export interface HistoryState {
  undoStack: PlanAction[];
  redoStack: PlanAction[];
  maxHistorySize: number;
}