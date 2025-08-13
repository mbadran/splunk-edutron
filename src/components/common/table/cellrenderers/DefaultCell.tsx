import React from "react";

// Base cell renderer interface
export interface CellRenderer<TData> {
  value: unknown;
  row: { original: TData; index: number };
  column: { id: string };
}

// Enhanced default cell renderer with consistent styling - HYDRATION FIX
export const DefaultCell = <TData,>({
  value,
  row,
  column,
  className = "",
}: CellRenderer<TData> & { className?: string }) => {
  // HYDRATION FIX: Use deterministic ID only when needed for testing
  const cellId = `cell-${column.id}-row-${row.index}`;

  return (
    <div id={cellId} className={`h-12 flex items-center px-3 ${className}`}>
      <span
        className="text-sm text-gray-700 truncate w-full"
        title={String(value || "")}
      >
        {String(value || "")}
      </span>
    </div>
  );
};