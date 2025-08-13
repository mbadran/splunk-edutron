import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { HistoryState, PlanAction } from "@/types/actions";

// History state with persistence - survives browser refreshes
const initialHistoryState: HistoryState = {
  undoStack: [],
  redoStack: [],
  maxHistorySize: 100, // Limit history to prevent memory issues
};

export const historyStateAtom = atomWithStorage<HistoryState>("planHistory", initialHistoryState);

// Derived atoms for undo/redo capabilities
export const canUndoAtom = atom((get) => {
  const history = get(historyStateAtom);
  return history.undoStack.length > 0;
});

export const canRedoAtom = atom((get) => {
  const history = get(historyStateAtom);
  return history.redoStack.length > 0;
});

// Helper to generate action ID
export const generateActionId = (): string => {
  return `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to add action to history
export const addToHistory = (get: any, set: any, action: PlanAction) => {
  const currentHistory = get(historyStateAtom);
  
  // Add to undo stack and clear redo stack
  const newUndoStack = [...currentHistory.undoStack, action];
  
  // Limit history size
  const trimmedUndoStack = newUndoStack.length > currentHistory.maxHistorySize
    ? newUndoStack.slice(-currentHistory.maxHistorySize)
    : newUndoStack;
  
  set(historyStateAtom, {
    ...currentHistory,
    undoStack: trimmedUndoStack,
    redoStack: [], // Clear redo stack on new action
  });
};