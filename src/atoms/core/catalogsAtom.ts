import { atom } from "jotai";
import { Catalog } from "@/types/types";

// Catalog state atoms - simple data storage only
export const catalogsAtom = atom<Catalog[]>([]);
export const catalogsLoadingAtom = atom<boolean>(false);
export const catalogsErrorAtom = atom<string | null>(null);

// Derived atoms for computed values
export const catalogsCountAtom = atom((get) => get(catalogsAtom).length);
export const totalCoursesAtom = atom((get) =>
  get(catalogsAtom).reduce(
    (total, catalog) => total + (catalog.courseCount || 0),
    0,
  ),
);