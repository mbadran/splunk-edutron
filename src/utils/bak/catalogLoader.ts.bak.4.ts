import Papa from "papaparse";
import { z } from "zod";
import { Course, Catalog, CatalogConfig } from "@/types/types";
import { CATALOG_CONFIGS } from "./constants";

// Zod schema for course validation
const CourseSchema = z.object({
  ID: z.string().min(1, "ID is required"),
  Name: z.string().min(1, "Name is required"),
  Category: z.string().default(""),
  Duration: z.coerce.number().nonnegative().default(0),
  Mode: z.string().default(""),
  Price: z.coerce.number().nonnegative().default(0),
  Language: z.string().default(""),
  PDF: z.string().default(""),
  Alias: z.string().default(""),
  STEP_ID: z.string().optional(),
});

const RawCourseSchema = z.record(z.unknown()).transform((data) => {
  // Normalize STEP_ID field variations
  const stepIdVariations = ["STEP ID", "Step ID", "step_id", "STEP_ID"];
  let stepId: string | undefined;

  for (const variation of stepIdVariations) {
    if (data[variation] && typeof data[variation] === "string") {
      stepId = String(data[variation]).trim();
      break;
    }
  }

  // Clean and transform the data
  const cleanData: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    const cleanKey = key.trim();
    if (!stepIdVariations.includes(key) || cleanKey === "STEP_ID") {
      cleanData[cleanKey] = typeof value === "string" ? value.trim() : value;
    }
  });

  if (stepId) {
    cleanData.STEP_ID = stepId;
  }

  return cleanData;
});

export const loadCoursesFromCSV = async (
  csvPath: string,
): Promise<Course[]> => {
  const response = await fetch(csvPath);
  if (!response.ok) {
    throw new Error(`Failed to load ${csvPath}: ${response.status}`);
  }
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      trimHeaders: true,
      delimitersToGuess: [",", "\t", "|", ";"],
      transform: (value) => {
        if (typeof value === "string") {
          return value.trim();
        }
        return value;
      },
      complete: (results) => {
        try {
          const courses: Course[] = [];
          const errors: string[] = [];

          for (const [index, row] of (results.data as any[]).entries()) {
            try {
              // First normalize the raw data
              const normalizedData = RawCourseSchema.parse(row);

              // Then validate against the course schema
              const course = CourseSchema.parse(normalizedData);
              courses.push(course);
            } catch (error) {
              if (error instanceof z.ZodError) {
                errors.push(
                  `Row ${index + 1}: ${error.errors.map((e) => e.message).join(", ")}`,
                );
              } else {
                errors.push(`Row ${index + 1}: ${error}`);
              }
            }
          }

          if (courses.length === 0) {
            reject(
              new Error(
                `No valid courses found in ${csvPath}. Errors: ${errors.join("; ")}`,
              ),
            );
          } else {
            if (errors.length > 0) {
              console.warn(
                `Some rows were skipped due to validation errors: ${errors.join("; ")}`,
              );
            }
            resolve(courses);
          }
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
};

export const loadCatalogWithCourses = async (
  catalogConfig: CatalogConfig,
): Promise<Catalog> => {
  try {
    const courses = await loadCoursesFromCSV(catalogConfig.csvPath);
    return {
      ...catalogConfig,
      courses,
      courseCount: courses.length,
    };
  } catch (error) {
    console.error(`Failed to load catalog ${catalogConfig.id}:`, error);
    // Return catalog without courses if loading fails
    return {
      ...catalogConfig,
      courses: [],
      courseCount: 0,
    };
  }
};

// Utility function that just loads all catalog configs - no atom manipulation
export const loadAllCatalogs = async (): Promise<Catalog[]> => {
  console.log("Loading all catalogs from CSV files...");
  
  const catalogPromises = CATALOG_CONFIGS.map((config) =>
    loadCatalogWithCourses(config)
  );
  
  const loadedCatalogs = await Promise.all(catalogPromises);
  
  console.log(`Successfully loaded ${loadedCatalogs.length} catalogs:`, 
    loadedCatalogs.map(c => `${c.name} (${c.courseCount} courses)`));
  
  return loadedCatalogs;
};