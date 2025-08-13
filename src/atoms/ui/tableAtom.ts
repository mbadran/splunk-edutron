import { atom } from "jotai";

// Table scroll reference atom for scroll-to-top functionality
export const tableScrollRefAtom = atom<{ scrollToOffset: (offset: number) => void } | null>(null);

// Helper to scroll table to top
export const scrollTableToTop = (get: any, set: any) => {
  const tableRef = get(tableScrollRefAtom);
  if (tableRef && tableRef.scrollToOffset) {
    tableRef.scrollToOffset(0);
  }
};