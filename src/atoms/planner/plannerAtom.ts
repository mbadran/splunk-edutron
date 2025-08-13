import { atom } from "jotai";
import { DEFAULT_CATALOG } from "@/utils/constants";

// Planner-specific atoms as per PRD data flow requirements
export const plannerCatalogsAtom = atom<string[]>([DEFAULT_CATALOG]); // Default to hardcoded catalog for MVP