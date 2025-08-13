import { useAtom } from "jotai";
import { useCatalogs } from "@/hooks/useCatalogs";

/**
 * Hook for catalog-specific data operations
 * Wraps the main useCatalogs hook with catalog-page specific logic
 */
export const useCatalogData = (catalogId?: string) => {
  const { catalogs, loading, error, catalogsCount, totalCourses, reloadCatalogs } = useCatalogs();
  
  // Find specific catalog if ID provided
  const selectedCatalog = catalogId 
    ? catalogs.find(catalog => catalog.id === catalogId || catalog.slug === catalogId)
    : null;

  // Get courses for the selected catalog
  const courses = selectedCatalog?.courses || [];

  return {
    // All catalogs data
    catalogs,
    catalogsCount,
    totalCourses,
    
    // Selected catalog data
    selectedCatalog,
    courses,
    
    // Status
    loading,
    error,
    
    // Actions
    reloadCatalogs,
  };
};