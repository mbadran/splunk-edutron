import { atom } from "jotai";

// Team editing state atoms
export const editingTeamMemberAtom = atom<number | null>(null);
export const editingTeamMemberValueAtom = atom<string>("");

// Budget editing state atoms
export const isEditingBudgetAtom = atom<boolean>(false);
export const budgetInputAtom = atom<string>("");