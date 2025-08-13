import React from "react";
import { useAtom } from "jotai";
import { Course } from "@/types/types";
import {
  catalogsAtom,
  catalogsLoadingAtom,
  catalogsErrorAtom,
} from "@/atoms/globalAtoms";

interface CatalogBaseProps {
  catalogId?: string; // Optional - defaults to first catalog if not provided
  children: (data: {
    courses: Course[];
    isLoading: boolean;
    error: string | null;
    catalogName?: string;
  }) => React.ReactNode;
}

const CatalogBase: React.FC<CatalogBaseProps> = ({ catalogId, children }) => {
  const [catalogs] = useAtom(catalogsAtom);
  const [isLoading] = useAtom(catalogsLoadingAtom);
  const [error] = useAtom(catalogsErrorAtom);

  // Get courses from the specified catalog or the first available catalog
  const targetCatalog = catalogId
    ? catalogs.find((catalog) => catalog.id === catalogId)
    : catalogs[0]; // Default to first catalog

  const courses = targetCatalog?.courses || [];
  const catalogName = targetCatalog?.name;

  console.log(
    "CatalogBase: Rendering with",
    courses.length,
    "courses from catalog:",
    catalogName || "default",
  );

  // Show loading state
  if (isLoading) {
    return (
      <div
        id="catalog-loading"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading catalogs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        id="catalog-error"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Catalogs
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please refresh the page to try again.
          </p>
        </div>
      </div>
    );
  }

  // Show no catalogs state
  if (catalogs.length === 0) {
    return (
      <div
        id="catalog-no-data"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Catalogs Available
          </h3>
          <p className="text-gray-600 mb-4">
            No training catalogs have been loaded yet.
          </p>
          <p className="text-sm text-gray-500">
            Please refresh the page to load catalogs.
          </p>
        </div>
      </div>
    );
  }

  // Show catalog not found state (when specific catalogId is requested but not found)
  if (catalogId && !targetCatalog) {
    return (
      <div
        id="catalog-not-found"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-yellow-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Catalog Not Found
          </h3>
          <p className="text-gray-600 mb-2">
            The catalog "{catalogId}" could not be found.
          </p>
          <p className="text-sm text-gray-500">
            Available catalogs: {catalogs.map(c => c.id).join(", ")}
          </p>
        </div>
      </div>
    );
  }

  return <>{children({ courses, isLoading, error, catalogName })}</>;
};

export default CatalogBase;