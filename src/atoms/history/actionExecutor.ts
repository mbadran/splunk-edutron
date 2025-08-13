import { atom } from "jotai";
import { PlanAction } from "@/types/actions";
import { planStateAtom, addCourseSelection, removeCourseSelection } from "@/atoms/planner/planStateAtom";
import { isCreditsUnitModeAtom } from "@/atoms/planner/planCalculatorAtom";
import { addToHistory } from "@/atoms/history/historyAtom";
import { setStatusAtom } from "@/atoms/ui/workingAtom";

// Action execution atom - applies actions and records them in history
export const executeActionAtom = atom(
  null,
  (get, set, action: PlanAction) => {
    const currentState = get(planStateAtom);
    
    // Apply the action to state
    let newState = { ...currentState };
    
    switch (action.type) {
      case "ADD_TEAM_MEMBER":
        newState.teamMembers = [...currentState.teamMembers];
        newState.teamMembers.splice(action.payload.index, 0, action.payload.member);
        break;
      
      case "REMOVE_TEAM_MEMBER":
        newState.teamMembers = currentState.teamMembers.filter((_, i) => i !== action.payload.index);
        // Remove selections for deleted member
        const updatedSelections = { ...currentState.selections };
        delete updatedSelections[action.payload.member.id];
        newState.selections = updatedSelections;
        break;
      
      case "UPDATE_TEAM_MEMBER":
        newState.teamMembers = [...currentState.teamMembers];
        newState.teamMembers[action.payload.index] = action.payload.newMember;
        break;
      
      case "TOGGLE_COURSE_SELECTION":
        if (action.payload.wasSelected) {
          // Remove selection
          newState.selections = removeCourseSelection(
            currentState.selections,
            action.payload.personId,
            action.payload.catalogId,
            action.payload.courseId
          );
        } else {
          // Add selection
          newState.selections = addCourseSelection(
            currentState.selections,
            action.payload.personId,
            action.payload.catalogId,
            action.payload.courseId
          );
        }
        break;
      
      case "UPDATE_TITLE":
        newState.title = action.payload.newTitle;
        break;
      
      case "UPDATE_NOTES":
        newState.notes = action.payload.newNotes;
        break;
      
      case "SET_BUDGET":
        newState.budget = action.payload.newBudget;
        break;
      
      case "RESET_SELECTIONS":
        // Clear selections instead of restoring old ones
        newState.selections = {};
        break;
      
      case "IMPORT_PLAN":
        // SAFETY CHECK: Ensure newPlanState is valid
        if (!action.payload.newPlanState || typeof action.payload.newPlanState !== 'object') {
          console.error("IMPORT_PLAN action has invalid newPlanState:", action.payload.newPlanState);
          set(setStatusAtom, { isWorking: false, message: "Import failed: Invalid plan data" });
          return;
        }
        newState = action.payload.newPlanState;
        break;
      
      case "TOGGLE_CREDITS_MODE":
        // This doesn't affect plan state, handle in calculator atom
        set(isCreditsUnitModeAtom, action.payload.newMode);
        break;
      
      default:
        console.warn(`Unknown action type: ${(action as any).type}`);
        return;
    }
    
    // SAFETY CHECK: Ensure newState is valid before updating updatedAt
    if (!newState || typeof newState !== 'object') {
      console.error("newState is invalid after action processing:", newState);
      set(setStatusAtom, { isWorking: false, message: "Action failed: Invalid state" });
      return;
    }
    
    // Update plan state
    newState.updatedAt = new Date().toISOString();
    set(planStateAtom, newState);
    
    // Add to history
    addToHistory(get, set, action);
    
    // Update status to show operation completed and clear after delay
    set(setStatusAtom, { isWorking: false, message: "Action completed" });
    setTimeout(() => {
      set(setStatusAtom, { isWorking: false, message: "" });
    }, 1000);
  },
);