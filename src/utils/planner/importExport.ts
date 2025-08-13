import { z } from "zod";
import { Plan, PlanState, PlanMetadata, PlanMetrics, Person, Course } from "@/types/types";
import { APP_VERSION } from "@/utils/constants";

// Zod schemas for import validation (updated structure)
const PersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().optional(),
  role: z.string().optional(),
  teamId: z.string().min(1),
});

const PlanMetadataSchema = z.object({
  id: z.string().min(1),
  appVersion: z.string().min(1),
  exportedAt: z.string().min(1),
});

const PlanStateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  notes: z.string().optional(),
  catalogs: z.array(z.string()).min(1),
  teams: z.array(z.string()).min(1),
  teamMembers: z.array(PersonSchema).min(1),
  selections: z.record(z.record(z.array(z.string()))),
  budget: z.number().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const PlanMetricsSchema = z.object({
  catalogs: z.number().min(0).optional(), // NEW - optional for backward compatibility
  costPerMember: z.record(z.number()),
  courses: z.number().min(0).optional(), // NEW - optional for backward compatibility
  selections: z.number().min(0), // Renamed from selectedCourses to match plan.selections
  teamMembers: z.number().min(0).optional(), // NEW - optional for backward compatibility
  teams: z.number().min(0).optional(), // NEW - optional for backward compatibility
  totalCost: z.number().min(0),
});

// Support both old and new formats for backward compatibility
const PlanSchema = z.object({
  metadata: PlanMetadataSchema,
  plan: PlanStateSchema,
  metrics: PlanMetricsSchema.optional(), // New format - optional
  totals: PlanMetricsSchema.optional(), // Old format - also optional, uses same schema now
});

// Import validation result
export interface ImportValidationResult {
  isValid: boolean;
  plan?: Plan;
  errors: string[];
  missingCourses: string[];
}

// Validate imported plan structure
export const validateImportedPlan = (data: unknown): ImportValidationResult => {
  const result: ImportValidationResult = {
    isValid: false,
    errors: [],
    missingCourses: [],
  };

  try {
    // Parse and validate the plan structure
    const plan = PlanSchema.parse(data);
    result.plan = plan;
    result.isValid = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
    } else {
      result.errors = [`Validation error: ${error}`];
    }
  }

  return result;
};

// Check if courses exist in current catalog
export const validateCourseExistence = (
  planSelections: Record<string, Record<string, string[]>>,
  availableCourses: Course[]
): string[] => {
  const missingCourses: Set<string> = new Set();
  const availableCourseIds = new Set(availableCourses.map(c => c.ID));

  // Check all course IDs in selections
  Object.values(planSelections).forEach(personSelections => {
    Object.values(personSelections).forEach(courseIds => {
      courseIds.forEach(courseId => {
        if (!availableCourseIds.has(courseId)) {
          missingCourses.add(courseId);
        }
      });
    });
  });

  return Array.from(missingCourses);
};

// Filter out missing courses from selections
export const filterMissingCourses = (
  planSelections: Record<string, Record<string, string[]>>,
  missingCourseIds: string[]
): Record<string, Record<string, string[]>> => {
  const missingSet = new Set(missingCourseIds);
  const filteredSelections: Record<string, Record<string, string[]>> = {};

  Object.entries(planSelections).forEach(([personId, personSelections]) => {
    const filteredPersonSelections: Record<string, string[]> = {};

    Object.entries(personSelections).forEach(([catalogId, courseIds]) => {
      const validCourseIds = courseIds.filter(courseId => !missingSet.has(courseId));
      
      // Only include catalogs that still have valid courses
      if (validCourseIds.length > 0) {
        filteredPersonSelections[catalogId] = validCourseIds;
      }
    });

    // Only include persons that still have valid selections
    if (Object.keys(filteredPersonSelections).length > 0) {
      filteredSelections[personId] = filteredPersonSelections;
    }
  });

  return filteredSelections;
};

// Check if current plan has any changes (non-default state)
export const hasNonDefaultPlanState = (planState: PlanState): boolean => {
  // Check if title is changed from default
  const hasCustomTitle = planState.title !== "Pied Piper / Splunk Training Plan";
  
  // Check if notes exist
  const hasCustomNotes = Boolean(planState.notes && planState.notes.trim());
  
  // Check if team members are changed (more than 1 or name changed)
  const hasCustomTeamMembers = planState.teamMembers.length > 1 || 
    (planState.teamMembers.length === 1 && planState.teamMembers[0].name !== "Richard Hendricks");
  
  // Check if any course selections exist
  const hasCourseSelections = Object.keys(planState.selections).length > 0;
  
  // Check if budget is set
  const hasBudget = planState.budget !== null;

  return hasCustomTitle || hasCustomNotes || hasCustomTeamMembers || hasCourseSelections || hasBudget;
};

// Parse JSON file content
export const parseImportFile = async (file: File): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        resolve(parsed);
      } catch (error) {
        reject(new Error(`Invalid JSON file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
};

// Complete import validation with course checking
export const validateCompleteImport = (
  data: unknown,
  availableCourses: Course[]
): ImportValidationResult => {
  const structureResult = validateImportedPlan(data);
  
  if (!structureResult.isValid || !structureResult.plan) {
    return structureResult;
  }

  // Check for missing courses
  const missingCourses = validateCourseExistence(
    structureResult.plan.plan.selections, // Updated path: plan.plan.selections
    availableCourses
  );

  return {
    ...structureResult,
    missingCourses,
  };
};

// === EXPORT FUNCTIONALITY (consolidated from exportUtils.ts) ===

/**
 * Generates filename for plan export with format: edutron_YYYY-MM-DDTHH-MM_plan-title-with-hyphens.json
 */
export const generateExportFilename = (planTitle: string, extension: string = 'json'): string => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Get local time in HH-MM format (24-hour)
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}-${minutes}`;
  
  // Clean plan title: replace spaces and special chars with hyphens
  const cleanTitle = planTitle
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '-')    // Replace ALL special characters (including /) with hyphens
    .replace(/-+/g, '-')            // Replace multiple consecutive hyphens with single
    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
  
  return `edutron_${dateStr}T${timeStr}_${cleanTitle}.${extension}`;
};

/**
 * Calculate plan metrics from plan state and additional data
 */
export const calculatePlanMetrics = (
  planState: PlanState,
  selectedCoursesCount: number,
  totalCost: number,
  costPerMember: Record<string, number>,
  totalAvailableCourses: number
): PlanMetrics => {
  return {
    catalogs: planState.catalogs.length,
    costPerMember: costPerMember,
    courses: totalAvailableCourses,
    selections: selectedCoursesCount, // Updated from selectedCourses
    teamMembers: planState.teamMembers.length,
    teams: planState.teams.length,
    totalCost: totalCost,
  };
};

/**
 * Exports plan data as JSON file with enhanced metadata and new structure
 */
export const exportPlanAsJSON = (
  planState: PlanState,
  selectedCoursesCount: number,
  totalCost: number,
  costPerMember: Record<string, number>,
  totalAvailableCourses: number = 0
): void => {
  const planMetrics = calculatePlanMetrics(
    planState,
    selectedCoursesCount,
    totalCost,
    costPerMember,
    totalAvailableCourses
  );

  const planExport: Plan = {
    metadata: {
      id: `export-${Date.now()}`,
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
    },
    plan: planState, // Updated from 'state'
    metrics: planMetrics, // Updated from 'totals'
    // Don't include courses array - keep export lean
  };

  const dataStr = JSON.stringify(planExport, null, 2);
  const filename = generateExportFilename(planState.title, 'json');

  // Try using the File System Access API if available, fallback to blob download
  if ('showSaveFilePicker' in window) {
    try {
      (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] },
        }],
      }).then((fileHandle: any) => {
        return fileHandle.createWritable();
      }).then((writable: any) => {
        writable.write(dataStr);
        writable.close();
      }).catch(() => {
        // Fallback to blob download if user cancels or API fails
        downloadWithBlob(dataStr, filename);
      });
    } catch {
      // Fallback to blob download if API not supported
      downloadWithBlob(dataStr, filename);
    }
  } else {
    // Fallback to blob download for browsers without File System Access API
    downloadWithBlob(dataStr, filename);
  }
};

// Helper function for blob download that works better in Safari
const downloadWithBlob = (dataStr: string, filename: string) => {
  const blob = new Blob([dataStr], { type: 'application/json' });
  
  // For Safari, we need to create a proper download experience
  if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    // Safari-specific handling
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.download = filename;
    linkElement.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(linkElement);
    linkElement.click();
    
    // Clean up after a delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(linkElement);
      URL.revokeObjectURL(url);
    }, 100);
  } else {
    // Standard approach for other browsers
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", filename);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  }
};