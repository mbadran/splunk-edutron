import { Course } from "@/types/types";
import { COURSE_URL_TEMPLATE, DETAILS_URL_TEMPLATE } from "@/utils/constants";

/**
 * Utility function to interpolate between two hex colors
 */
export const interpolateColor = (startColor: string, endColor: string, factor: number): string => {
  const start = {
    r: parseInt(startColor.slice(1, 3), 16),
    g: parseInt(startColor.slice(3, 5), 16),
    b: parseInt(startColor.slice(5, 7), 16)
  };
  
  const end = {
    r: parseInt(endColor.slice(1, 3), 16),
    g: parseInt(endColor.slice(3, 5), 16),
    b: parseInt(endColor.slice(5, 7), 16)
  };
  
  const r = Math.round(start.r + (end.r - start.r) * factor);
  const g = Math.round(start.g + (end.g - start.g) * factor);
  const b = Math.round(start.b + (end.b - start.b) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Generate course URL from STEP_ID
 */
export const generateCourseUrl = (course: Course): string => {
  if (course.STEP_ID) {
    return COURSE_URL_TEMPLATE.replace('<STEP_ID>', course.STEP_ID);
  }
  return '#';
};

/**
 * Generate course details PDF URL from alias
 */
export const generateDetailsUrl = (course: Course): string => {
  if (course.Alias) {
    return DETAILS_URL_TEMPLATE.replace('<COURSE_ALIAS>', course.Alias.toLowerCase());
  }
  return '#';
};