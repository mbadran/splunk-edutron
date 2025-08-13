// Main globalAtoms.ts - Re-exports all atoms from organized structure

// UI State
export * from "./ui/workingAtom";
export * from "./ui/tableAtom";
export * from "./ui/editingAtom";

// Core Data
export * from "./core/catalogsAtom";

// Planner State
export * from "./planner/plannerAtom";
export * from "./planner/planStateAtom";
export * from "./planner/planCalculatorAtom";

// Plan Actions - now importing from planActionsAtom
export * from "./planner/planActionsAtom";

// History Management
export * from "./history/historyAtom";
export * from "./history/actionExecutor";
export * from "./history/undoRedoAtom";

// Table History Management
export * from "./table/tableHistoryAtom";

// Keep backward compatibility for any remaining direct imports
// These are the main atoms that components typically import
export {
  // Working state
  workingAtom,
  workingMessageAtom,
  setStatusAtom,
} from "./ui/workingAtom";

export {
  // Plan state
  planStateAtom,
  plannerCoursesAtom,
  planTotalAtom,
  planCostPerMemberAtom,
  planSelectedCoursesAtom,
  updatePlanStateAtom,
} from "./planner/planStateAtom";

export {
  // History state
  canUndoAtom,
  canRedoAtom,
} from "./history/historyAtom";

export {
  // History actions
  undoAtom,
  redoAtom,
} from "./history/undoRedoAtom";

export {
  // Plan actions
  exportPlanAtom,
  setBudgetAtom,
  addTeamMemberAtom,
  updateTeamMemberAtom,
  deleteTeamMemberAtom,
  createNewPlanAtom,
  resetPlanSelectionsAtom,
  importPlanAtom,
  updateTitleAtom,
  updateNotesAtom,
  toggleCreditsModeAtom,
  toggleSelectionAtom,
} from "./planner/planActionsAtom";