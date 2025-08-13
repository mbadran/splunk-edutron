import { atom } from "jotai";
import { Status } from "@/types/types";

// Global working indicator state
export const workingAtom = atom<boolean>(false);
export const workingMessageAtom = atom<string>("");

// Working indicator helper - simplified
export const setStatusAtom = atom(
  null,
  (get, set, { isWorking, message }: Status) => {
    set(workingAtom, isWorking);
    set(workingMessageAtom, message || "");
  },
);