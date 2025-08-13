import React from "react";
import { Undo, Redo, Columns3Cog } from "lucide-react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { setStatusAtom } from "@/atoms/globalAtoms";
import { useTableHistory } from "@/hooks/shared/useTableHistory";

// CatalogTable state atoms - exported for CatalogTable to use
export const catalogTableSortingAtom = atomWithStorage("catalogTableSorting", []);
export const catalogTableFiltersAtom = atomWithStorage("catalogTableFilters", []);
export const catalogTableColumnOrderAtom = atomWithStorage("catalogTableColumnOrder", []);

interface CatalogActionsProps {
  tableId?: string;
}

const CatalogActions: React.FC<CatalogActionsProps> = ({ tableId = "catalog" }) => {
  const [, setStatus] = useAtom(setStatusAtom);

  // Table state atoms
  const [tableSorting, setTableSorting] = useAtom(catalogTableSortingAtom);
  const [tableFilters, setTableFilters] = useAtom(catalogTableFiltersAtom);
  const [tableColumnOrder, setTableColumnOrder] = useAtom(catalogTableColumnOrderAtom);

  // Table history management using consolidated hook
  const tableHistory = useTableHistory({
    tableId,
    tableSorting,
    tableFilters,
    tableColumnOrder,
    setTableSorting,
    setTableFilters,
    setTableColumnOrder,
  });

  const handleUndo = () => {
    console.log(`Catalog table undo requested for ${tableId}`);
    tableHistory.handleUndo();
  };

  const handleRedo = () => {
    console.log(`Catalog table redo requested for ${tableId}`);
    tableHistory.handleRedo();
  };

  const handleReset = () => {
    console.log(`Catalog table reset requested for ${tableId}`);
    tableHistory.handleReset();
  };

  return (
    <div
      id="catalog-actions" 
      className="flex items-start justify-start gap-1 sm:gap-2 lg:gap-3 flex-wrap"
    >
      {/* Undo */}
      <button
        onClick={handleUndo}
        disabled={!tableHistory.canUndo}
        title="Undo Table Change"
        className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Undo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>

      {/* Redo */}
      <button
        onClick={handleRedo}
        disabled={!tableHistory.canRedo}
        title="Redo Table Change"
        className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Redo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>

      {/* Divider */}
      <div className="w-2 sm:w-4 lg:w-6"></div>

      {/* Reset Table Settings */}
      <button
        onClick={handleReset}
        title="Reset Table Settings"
        className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
        aria-label="Reset Table Settings"
      >
        <Columns3Cog className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
};

// Event handlers for CatalogTable to use with history tracking
export const useCatalogTableEventHandlers = () => {
  const [tableSorting] = useAtom(catalogTableSortingAtom);
  const [tableFilters] = useAtom(catalogTableFiltersAtom);
  const [tableColumnOrder] = useAtom(catalogTableColumnOrderAtom);
  const [, setTableSorting] = useAtom(catalogTableSortingAtom);
  const [, setTableFilters] = useAtom(catalogTableFiltersAtom);
  const [, setTableColumnOrder] = useAtom(catalogTableColumnOrderAtom);

  const tableHistory = useTableHistory({
    tableId: "catalog",
    tableSorting,
    tableFilters,
    tableColumnOrder,
    setTableSorting,
    setTableFilters,
    setTableColumnOrder,
  });

  return {
    // Current state for TanStack table
    sorting: tableSorting,
    columnFilters: tableFilters,
    columnOrder: tableColumnOrder,
    
    // Event handlers with history tracking
    onSortingChange: tableHistory.handleSortingChange,
    onColumnFiltersChange: tableHistory.handleFiltersChange,
    onColumnOrderChange: tableHistory.handleColumnOrderChange,
  };
};

export default CatalogActions;