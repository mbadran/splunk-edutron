import useUndo from 'use-undo';
import { useCallback, useRef } from 'react';
import { setStatusAtom } from '@/atoms/globalAtoms';
import { useAtom } from 'jotai';

interface TableState {
  sorting: any[];
  filters: any[];
  columnOrder: any[];
}

interface UseTableHistoryProps {
  tableId: string;
  tableSorting: any[];
  tableFilters: any[];
  tableColumnOrder: any[];
  setTableSorting: (sorting: any[]) => void;
  setTableFilters: (filters: any[]) => void;
  setTableColumnOrder: (order: any[]) => void;
}

export const useTableHistory = ({
  tableId,
  tableSorting,
  tableFilters,
  tableColumnOrder,
  setTableSorting,
  setTableFilters,
  setTableColumnOrder,
}: UseTableHistoryProps) => {
  const [, setStatus] = useAtom(setStatusAtom);

  // Debounce timer for filter changes
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize use-undo with current table state
  const [
    tableState,
    {
      set: setTableState,
      undo,
      redo,
      canUndo,
      canRedo,
      reset: resetHistory
    }
  ] = useUndo<TableState>({
    sorting: tableSorting,
    filters: tableFilters,
    columnOrder: tableColumnOrder,
  });

  // Sync use-undo state back to atoms when undo/redo happens
  const syncToAtoms = useCallback((state: TableState) => {
    console.log(`[${tableId}] Syncing state to atoms:`, state);
    setTableSorting(state.sorting);
    setTableFilters(state.filters);
    setTableColumnOrder(state.columnOrder);
  }, [tableId, setTableSorting, setTableFilters, setTableColumnOrder]);

  // Save current state to history
  const saveToHistory = useCallback((sorting: any[], filters: any[], columnOrder: any[]) => {
    const newState = { sorting, filters, columnOrder };
    console.log(`[${tableId}] Saving to history:`, newState);
    setTableState(newState);
  }, [tableId, setTableState]);

  // Debounced save for filter changes
  const saveToHistoryDebounced = useCallback((sorting: any[], filters: any[], columnOrder: any[]) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      saveToHistory(sorting, filters, columnOrder);
    }, 750); // 750ms debounce for filter typing
  }, [saveToHistory]);

  // Event handlers - save CURRENT state to history BEFORE making changes
  const handleSortingChange = useCallback((sorting: any[]) => {
    console.log(`[${tableId}] Sorting changed:`, sorting);
    
    // Save CURRENT state to history BEFORE changing
    saveToHistory(tableSorting, tableFilters, tableColumnOrder);
    
    // Then update atom
    setTableSorting(sorting);
  }, [tableId, tableSorting, tableFilters, tableColumnOrder, setTableSorting, saveToHistory]);

  const handleFiltersChange = useCallback((filters: any[]) => {
    console.log(`[${tableId}] Filters changed:`, filters);
    
    // Save CURRENT state to history BEFORE changing (debounced)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      saveToHistory(tableSorting, tableFilters, tableColumnOrder);
    }, 750);
    
    // Update atom immediately
    setTableFilters(filters);
  }, [tableId, tableSorting, tableFilters, tableColumnOrder, setTableFilters, saveToHistory]);

  const handleColumnOrderChange = useCallback((order: any[]) => {
    console.log(`[${tableId}] Column order changed:`, order);
    
    // Save CURRENT state to history BEFORE changing
    saveToHistory(tableSorting, tableFilters, tableColumnOrder);
    
    // Then update atom
    setTableColumnOrder(order);
  }, [tableId, tableSorting, tableFilters, tableColumnOrder, setTableColumnOrder, saveToHistory]);

  // Undo handler
  const handleUndo = useCallback(() => {
    if (!canUndo) {
      console.log(`[${tableId}] Cannot undo - no history available`);
      return;
    }
    
    console.log(`[${tableId}] Executing undo`);
    setStatus({ isWorking: true, message: "Undoing table change..." });
    
    undo();
    
    // Sync the previous state back to atoms
    if (tableState.past.length > 0) {
      const previousState = tableState.past[tableState.past.length - 1];
      syncToAtoms(previousState);
    }
    
    setTimeout(() => {
      setStatus({ isWorking: false, message: "Table change undone!" });
      setTimeout(() => setStatus({ isWorking: false, message: "" }), 1500);
    }, 300);
  }, [tableId, canUndo, undo, syncToAtoms, tableState.past, setStatus]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (!canRedo) {
      console.log(`[${tableId}] Cannot redo - no future available`);
      return;
    }
    
    console.log(`[${tableId}] Executing redo`);
    setStatus({ isWorking: true, message: "Redoing table change..." });
    
    redo();
    
    // Sync the next state back to atoms
    if (tableState.future.length > 0) {
      const nextState = tableState.future[0];
      syncToAtoms(nextState);
    }
    
    setTimeout(() => {
      setStatus({ isWorking: false, message: "Table change redone!" });
      setTimeout(() => setStatus({ isWorking: false, message: "" }), 1500);
    }, 300);
  }, [tableId, canRedo, redo, syncToAtoms, tableState.future, setStatus]);

  // Reset handler
  const handleReset = useCallback(() => {
    const hasSettings = tableSorting.length > 0 || tableFilters.length > 0 || tableColumnOrder.length > 0;
    
    if (!hasSettings) {
      setStatus({ isWorking: false, message: "No table settings to reset" });
      setTimeout(() => setStatus({ isWorking: false, message: "" }), 2000);
      return;
    }

    console.log(`[${tableId}] Resetting table settings`);
    setStatus({ isWorking: true, message: "Resetting table settings..." });
    
    // Save current state to history before reset
    saveToHistory(tableSorting, tableFilters, tableColumnOrder);
    
    // Clear all settings
    const emptyState = { sorting: [], filters: [], columnOrder: [] };
    setTableState(emptyState);
    syncToAtoms(emptyState);

    setTimeout(() => {
      setStatus({ isWorking: false, message: "Table settings reset!" });
      setTimeout(() => setStatus({ isWorking: false, message: "" }), 1500);
    }, 300);
  }, [tableId, tableSorting, tableFilters, tableColumnOrder, setTableSorting, setTableFilters, setTableColumnOrder, saveToHistory, setTableState, syncToAtoms, setStatus]);

  return {
    // State
    canUndo,
    canRedo,
    
    // Event handlers for TanStack table integration
    handleSortingChange,
    handleFiltersChange, 
    handleColumnOrderChange,
    
    // Action handlers for buttons
    handleUndo,
    handleRedo,
    handleReset,
    
    // Manual snapshot creation for custom actions (compatible with existing API)
    createSnapshot: saveToHistory,
  };
};