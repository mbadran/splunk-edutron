import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { Course, Catalog } from "@/types/types";
import {
  catalogsAtom,
  catalogsLoadingAtom,
  catalogsErrorAtom,
} from "@/atoms/globalAtoms";
import { useCatalogs } from "@/hooks/shared/useCatalogs";

interface CourseBaseProps {
  catalogSlug: string;
  courseSlug: string; // lowercase version of course ID
  children: (data: {
    course: Course | null;
    catalog: Catalog | null;
    isLoading: boolean;
    error: string | null;
    courseNotFound: boolean;
    catalogNotFound: boolean;
  }) => React.ReactNode;
}

const CourseBase: React.FC<CourseBaseProps> = ({ 
  catalogSlug, 
  courseSlug, 
  children 
}) => {
  // Use the useCatalogs hook to ensure catalogs are loaded
  const { catalogs, loading, error } = useCatalogs();

  // Find catalog by slug
  const targetCatalog = catalogs.find(
    (catalog) => catalog.slug === catalogSlug
  );

  // Find course by case-insensitive ID match to courseSlug
  const targetCourse = targetCatalog?.courses?.find(
    (course) => course.ID.toLowerCase() === courseSlug.toLowerCase()
  ) || null;

  const catalogNotFound = !loading && !error && catalogs.length > 0 && !targetCatalog;
  const courseNotFound = !loading && !error && targetCatalog && !targetCourse;

  console.log(
    "CourseBase: catalogSlug =", catalogSlug,
    "courseSlug =", courseSlug,
    "catalog found =", !!targetCatalog,
    "course found =", !!targetCourse,
    "catalogs.length =", catalogs.length,
    "loading =", loading,
    "error =", error
  );

  return (
    <>
      {children({
        course: targetCourse,
        catalog: targetCatalog,
        isLoading: loading,
        error,
        courseNotFound,
        catalogNotFound,
      })}
    </>
  );
};

export default CourseBase;