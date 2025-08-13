import React from "react";

// Hook to provide mono table (planner) state reset functionality
export const useMonoTable = () => {
  const resetTableState = React.useCallback(() => {
    // FIXED: Clear all mono table-related localStorage items with camelCase naming
    const keysToRemove = [
      'monoTableSorting',
      'monoTableFilters', 
      'monoTableColumnOrder'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Mono table state reset. Reloading page...');
    
    // Reload the page to reset immediately
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  // Expose reset function globally for debugging
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetMonoTableState = resetTableState;
      console.log('Mono table state reset function available globally as window.resetMonoTableState()');
    }
  }, [resetTableState]);

  return {
    resetTableState,
    instructions: 'Use resetTableState() to clear column order, sorting, and filters. Page will reload automatically.'
  };
};