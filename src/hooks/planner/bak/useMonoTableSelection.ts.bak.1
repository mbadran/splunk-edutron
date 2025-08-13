import { useAtom } from "jotai";
import { useMemo, useCallback } from "react";
import { Course, Person } from "@/types/types";
import {
  planStateAtom,
  plannerCoursesAtom,
  toggleSelectionAtom,
  createPlanSelectionKey,
} from "@/atoms/globalAtoms";

export interface MonoTableSelectionHook {
  isSelected: (course: Course, member: Person) => boolean;
  handleToggleSelection: (course: Course, member: Person) => void;
  getRowSelectionState: () => Record<string, boolean>;
  onRowSelectionChange: (updater: any) => void;
}

/**
 * Custom hook for managing MonoTable selection using TanStack's native row selection
 */
export const useMonoTableSelection = (): MonoTableSelectionHook => {
  const [planState] = useAtom(planStateAtom);
  const [courses] = useAtom(plannerCoursesAtom);
  const [, toggleSelection] = useAtom(toggleSelectionAtom);

  // Convert our selection format to TanStack's row selection format
  const getRowSelectionState = useCallback(() => {
    const rowSelection: Record<string, boolean> = {};
    
    courses?.forEach((course, courseIndex) => {
      planState.teamMembers.forEach((member) => {
        const key = createPlanSelectionKey(member.name, course.ID);
        if (planState.selections[key]) {
          rowSelection[`${courseIndex}-${member.id}`] = true;
        }
      });
    });
    
    return rowSelection;
  }, [courses, planState.selections, planState.teamMembers]);

  // Handle TanStack row selection changes
  const onRowSelectionChange = useCallback((updater: any) => {
    // This will be handled by our custom selection logic
    // TanStack will trigger re-renders automatically
    console.log("Row selection changed:", updater);
  }, []);

  // Check if a specific course/member combination is selected
  const isSelected = useCallback((course: Course, member: Person) => {
    const key = createPlanSelectionKey(member.name, course.ID);
    return planState.selections[key] || false;
  }, [planState.selections]);

  // Handle selection toggle
  const handleToggleSelection = useCallback((course: Course, member: Person) => {
    toggleSelection({ course, member });
  }, [toggleSelection]);

  return {
    isSelected,
    handleToggleSelection,
    getRowSelectionState,
    onRowSelectionChange,
  };
};