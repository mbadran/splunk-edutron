import React from "react";

// Hook to provide catalog table state reset functionality
export const useCatalogTable = () => {
  const resetTableState = React.useCallback(() => {
    // Clear all catalog table-related localStorage items
    const keysToRemove = [
      'catalog-table-sorting',
      'catalog-table-filters', 
      'catalog-table-column-order'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Catalog table state reset. Reloading page...');
    
    // Reload the page to reset immediately
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  // Expose reset function globally for debugging
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetCatalogTableState = resetTableState;
      console.log('Catalog table state reset function available globally as window.resetCatalogTableState()');
    }
  }, [resetTableState]);

  return {
    resetTableState,
    instructions: 'Use resetTableState() to clear column order, sorting, and filters. Page will reload automatically.'
  };
};