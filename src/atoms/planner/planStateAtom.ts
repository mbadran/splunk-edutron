import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Course, PlanState, Person } from "@/types/types";
import { DEFAULT_PLAN_TITLE, DEFAULT_TEAM_NAMES, DEFAULT_CATALOG } from "@/utils/constants";
import { catalogsAtom } from "@/atoms/core/catalogsAtom";

// Helper to generate random ID with prefix
const generateRandomId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to add course selection for a person in a specific catalog
export const addCourseSelection = (
  selections: Record<string, Record<string, string[]>>, 
  personId: string, 
  catalogId: string, 
  courseId: string
): Record<string, Record<string, string[]>> => {
  const personSelections = selections[personId] || {};
  const catalogCourses = personSelections[catalogId] || [];
  
  if (!catalogCourses.includes(courseId)) {
    return {
      ...selections,
      [personId]: {
        ...personSelections,
        [catalogId]: [...catalogCourses, courseId],
      },
    };
  }
  
  return selections;
};

// Helper function to remove course selection for a person in a specific catalog
export const removeCourseSelection = (
  selections: Record<string, Record<string, string[]>>, 
  personId: string, 
  catalogId: string, 
  courseId: string
): Record<string, Record<string, string[]>> => {
  const personSelections = selections[personId] || {};
  const catalogCourses = personSelections[catalogId] || [];
  
  const updatedCourses = catalogCourses.filter(id => id !== courseId);
  
  if (updatedCourses.length === 0) {
    // Remove empty catalog
    const { [catalogId]: removed, ...restCatalogs } = personSelections;
    
    if (Object.keys(restCatalogs).length === 0) {
      // Remove empty person
      const { [personId]: removedPerson, ...restSelections } = selections;
      return restSelections;
    }
    
    return {
      ...selections,
      [personId]: restCatalogs,
    };
  }
  
  return {
    ...selections,
    [personId]: {
      ...personSelections,
      [catalogId]: updatedCourses,
    },
  };
};

// Helper function to check if person has course selected in a specific catalog
export const hasSelectionForCourse = (
  selections: Record<string, Record<string, string[]>>, 
  personId: string, 
  catalogId: string, 
  courseId: string
): boolean => {
  const personSelections = selections[personId] || {};
  const catalogCourses = personSelections[catalogId] || [];
  return catalogCourses.includes(courseId);
};

// Create initial plan state with random IDs (consistent format)
const createInitialPlanState = (): PlanState => {
  const dynamicTeamId = generateRandomId('team');
  
  const defaultMember: Person = {
    id: generateRandomId('person'),
    name: DEFAULT_TEAM_NAMES[0],
    teamId: dynamicTeamId,
  };

  return {
    id: generateRandomId('plan'),
    title: DEFAULT_PLAN_TITLE,
    notes: "",
    catalogs: [DEFAULT_CATALOG],
    teams: [dynamicTeamId],
    teamMembers: [defaultMember],
    selections: {},
    budget: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Global plan state atom - localStorage persistence
export const planStateAtom = atomWithStorage<PlanState>("planState", createInitialPlanState());

// Derived atom to get all courses from planner-selected catalogs
export const plannerCoursesAtom = atom((get) => {
  const catalogs = get(catalogsAtom);
  const planState = get(planStateAtom);
  
  const courses: Course[] = [];
  planState.catalogs.forEach(catalogId => {
    const catalog = catalogs.find(c => c.id === catalogId);
    if (catalog && catalog.courses) {
      courses.push(...catalog.courses);
    }
  });
  
  return courses;
});

// Derived atom for plan total calculation
export const planTotalAtom = atom((get) => {
  const courses = get(plannerCoursesAtom);
  const planState = get(planStateAtom);
  
  let total = 0;
  Object.values(planState.selections).forEach(personSelections => {
    Object.values(personSelections).forEach(courseIds => {
      courseIds.forEach(courseId => {
        const course = courses.find(c => c.ID === courseId);
        if (course) {
          total += course.Price;
        }
      });
    });
  });
  
  return total;
});

// Derived atom for cost per member calculation - FIXED to use person IDs
export const planCostPerMemberAtom = atom((get) => {
  const courses = get(plannerCoursesAtom);
  const planState = get(planStateAtom);
  const costPerMember: Record<string, number> = {};
  
  // Initialize all team members with 0 cost using person ID as key
  planState.teamMembers.forEach(member => {
    costPerMember[member.id] = 0;
  });
  
  // Calculate cost for each member based on selections using person ID
  Object.entries(planState.selections).forEach(([personId, personSelections]) => {
    let memberCost = 0;
    Object.values(personSelections).forEach(courseIds => {
      courseIds.forEach(courseId => {
        const course = courses.find(c => c.ID === courseId);
        if (course) {
          memberCost += course.Price;
        }
      });
    });
    
    costPerMember[personId] = memberCost;
  });
  
  return costPerMember;
});

// Derived atom for selected courses count
export const planSelectedCoursesAtom = atom((get) => {
  const planState = get(planStateAtom);
  return Object.values(planState.selections).reduce((total, personSelections) => {
    return total + Object.values(personSelections).reduce((memberTotal, courseIds) => {
      return memberTotal + courseIds.length;
    }, 0);
  }, 0);
});

// Plan state update helpers
export const updatePlanStateAtom = atom(
  null,
  (get, set, updates: Partial<PlanState>) => {
    const currentState = get(planStateAtom);
    const updatedState = {
      ...currentState,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    set(planStateAtom, updatedState);
  },
);

// Export the helper function for creating initial plan state
export { createInitialPlanState };