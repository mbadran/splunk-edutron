import { useRef } from "react";
import { useAtom } from "jotai";
import { 
  scrollTopAtom, 
  isScrollingSyncAtom, 
  syncScrollAtom,
  setStatusAtom 
} from "@/atoms/globalAtoms";

export const useScrollSync = () => {
  const [scrollTop] = useAtom(scrollTopAtom);
  const [isScrollingSync] = useAtom(isScrollingSyncAtom);
  const [, syncScroll] = useAtom(syncScrollAtom);
  const [, setStatus] = useAtom(setStatusAtom);
  
  const catalogTableRef = useRef<any>(null);
  const teamTableRef = useRef<any>(null);

  const handleCatalogScroll = (scrollOffset: number) => {
    if (isScrollingSync) return;

    // Update scroll state and trigger sync
    syncScroll({ scrollOffset });

    // Apply scroll to team table
    if (teamTableRef.current?.scrollToOffset) {
      try {
        teamTableRef.current.scrollToOffset(scrollOffset);
      } catch (error) {
        console.warn("Failed to sync scroll to team table:", error);
        setStatus({ isWorking: false, message: "Scroll sync temporarily disabled" });
      }
    }
  };

  const handleTeamScroll = (scrollOffset: number) => {
    if (isScrollingSync) return;

    // Update scroll state and trigger sync
    syncScroll({ scrollOffset });

    // Apply scroll to catalog table
    if (catalogTableRef.current?.scrollToOffset) {
      try {
        catalogTableRef.current.scrollToOffset(scrollOffset);
      } catch (error) {
        console.warn("Failed to sync scroll to catalog table:", error);
        setStatus({ isWorking: false, message: "Scroll sync temporarily disabled" });
      }
    }
  };

  return {
    scrollTop,
    catalogTableRef,
    teamTableRef,
    handleCatalogScroll,
    handleTeamScroll,
  };
};