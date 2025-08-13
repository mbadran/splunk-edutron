import React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  GripVertical,
} from "lucide-react";
import { Column } from "@tanstack/react-table";
import { TABLE_DEFAULTS } from "@/utils/constants";

// Add Grid2x2 icon for new plan action
export { Grid2x2 } from "lucide-react";

// Enhanced table header component with rich styling and better UX
export const TableHeader = <TData,>({
  column,
  children,
  className = "",
  showMoveHandle = false,
  onMoveColumn,
}: {
  column: Column<TData, unknown>;
  children: React.ReactNode;
  className?: string;
  showMoveHandle?: boolean;
  onMoveColumn?: (columnId: string, direction: "left" | "right") => void;
}) => {
  const canSort = column.getCanSort();
  const sortDirection = column.getIsSorted();
  const canFilter = column.getCanFilter();
  const filterValue = column.getFilterValue();
  const hasFilter = filterValue !== undefined && filterValue !== "";
  const isSorted = sortDirection !== false;

  const [showFilterInput, setShowFilterInput] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    (filterValue ?? "") as string,
  );
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  // Sync input value with filter value when filter changes externally
  React.useEffect(() => {
    setInputValue((filterValue ?? "") as string);
  }, [filterValue]);

  // Debounced filtering with configurable delay
  const handleFilterChange = React.useCallback(
    (value: string) => {
      setInputValue(value);

      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new debounced timer using constant
      const newTimer = setTimeout(() => {
        column.setFilterValue(value || undefined);
      }, TABLE_DEFAULTS.FILTER_DEBOUNCE_MS || 300);

      setDebounceTimer(newTimer);
    },
    [column, debounceTimer],
  );

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Determine header text color based on active states
  const getHeaderTextColor = () => {
    if (hasFilter || isSorted) return "text-orange-300";
    return "text-white";
  };

  // Get background color for active states
  const getHeaderBgColor = () => {
    if (hasFilter || isSorted) return "bg-orange-600/20";
    return "";
  };

  // Drag and drop handlers for column reordering
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", column.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedColumnId = e.dataTransfer.getData("text/plain");
    if (draggedColumnId && draggedColumnId !== column.id && onMoveColumn) {
      const rect = e.currentTarget.getBoundingClientRect();
      const dragX = e.clientX - rect.left;
      const isLeftDrop = dragX < rect.width / 2;
      onMoveColumn(draggedColumnId, isLeftDrop ? "left" : "right");
    }
  };

  return (
    <div 
      className={`w-full h-full ${className} ${getHeaderBgColor()} rounded-sm transition-colors`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Row 1: Column Title with enhanced styling */}
      <div
        className={`flex items-center justify-start w-full text-sm font-bold h-8 px-3 ${getHeaderTextColor()} transition-colors`}
      >
        <span className="truncate tracking-wide">{children}</span>
      </div>

      {/* Row 2: Controls OR Filter Input */}
      <div className="flex items-center justify-start w-full h-6 px-2">
        {showFilterInput && canFilter ? (
          /* Enhanced Filter Input */
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              e.stopPropagation();
              handleFilterChange(e.target.value);
            }}
            onBlur={() => setShowFilterInput(false)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Escape") {
                setShowFilterInput(false);
              }
              if (e.key === "Enter") {
                setShowFilterInput(false);
              }
            }}
            placeholder={`Filter ${children}...`}
            className="w-full px-2 py-1 text-xs text-gray-900 bg-white/90 border-2 border-orange-300 rounded-md outline-none placeholder-gray-500 font-medium shadow-sm focus:border-orange-400 focus:bg-white"
            autoFocus
          />
        ) : (
          /* Enhanced Controls Row */
          <div className="flex items-center gap-1.5">
            {/* Move Handle with improved styling */}
            {showMoveHandle && onMoveColumn && (
              <div
                className="cursor-grab hover:cursor-grab active:cursor-grabbing p-1 rounded opacity-60 hover:opacity-100 hover:text-orange-200 hover:bg-white/10 transition-all duration-200"
                title="Drag to reorder column"
                draggable={true}
                onDragStart={handleDragStart}
              >
                <GripVertical className="w-3 h-3" />
              </div>
            )}

            {/* Enhanced Sort Button */}
            {canSort && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  column.toggleSorting();
                }}
                className={`p-1 rounded opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-white/10 ${
                  isSorted 
                    ? "text-orange-200 opacity-100 bg-white/10" 
                    : "hover:text-orange-200"
                }`}
                title={
                  sortDirection === "asc" 
                    ? `Sorted ascending - click to sort descending`
                    : sortDirection === "desc"
                    ? `Sorted descending - click to remove sorting`
                    : `Sort by ${children}`
                }
                type="button"
              >
                {sortDirection === "asc" ? (
                  <ArrowUp className="w-3 h-3" />
                ) : sortDirection === "desc" ? (
                  <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Enhanced Filter Toggle */}
            {canFilter && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterInput(true);
                }}
                className={`p-1 rounded opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-white/10 ${
                  hasFilter 
                    ? "text-orange-200 opacity-100 bg-white/10" 
                    : "hover:text-orange-200"
                }`}
                title={
                  hasFilter 
                    ? `Filtered by "${filterValue}" - click to edit filter`
                    : "Click to filter this column"
                }
                type="button"
              >
                <Filter className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};