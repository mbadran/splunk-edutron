import React, { useRef } from "react";
import {
  Table,
  flexRender,
  ColumnResizeMode,
  Column,
  ColumnDef,
  SortDirection,
} from "@tanstack/react-table";
import { GripVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useAtom } from "jotai";
import { atom } from "jotai";
import { TABLE_DEFAULTS } from "@/utils/constants";

// Simplified Jotai atoms for app-specific state only
const tableContainerHeightAtom = atom<number>(TABLE_DEFAULTS.CONTAINER_HEIGHT);

// Simplified column configuration interface
export interface BaseTableColumnConfig {
  size?: number;
  minSize?: number;
  maxSize?: number;
  enableSorting?: boolean;
  enableResizing?: boolean;
}

// Forward ref interface for BaseTable
export interface BaseTableRef {
  scrollToOffset: (offset: number) => void;
}

// Simplified sortable header component using native TanStack features
export const SortableHeader = <TData,>({
  column,
  children,
  showDragHandle = false,
}: {
  column: Column<TData, unknown>;
  children: React.ReactNode;
  showDragHandle?: boolean;
}) => {
  const canSort = column.getCanSort();
  const sortDirection = column.getIsSorted();

  return (
    <div className="flex items-center gap-2 w-full">
      {showDragHandle && (
        <div
          className="cursor-grab hover:cursor-grab active:cursor-grabbing p-1 hover:bg-white rounded transition-colors opacity-50 hover:opacity-100"
          title="Drag to reorder column"
          role="button"
          tabIndex={0}
          aria-label="Drag to reorder column"
        >
          <GripVertical className="w-3 h-3" />
        </div>
      )}

      <div
        className={`flex items-center gap-1 px-1 py-1 rounded transition-colors flex-1 min-w-0 ${
          canSort ? "cursor-pointer select-none hover:bg-white" : ""
        }`}
        onClick={() => canSort && column.toggleSorting()}
        role={canSort ? "button" : undefined}
        tabIndex={canSort ? 0 : undefined}
        aria-label={canSort ? `Sort by ${children}` : undefined}
        aria-sort={
          sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : canSort
                ? "none"
                : undefined
        }
        onKeyDown={(e) => {
          if (canSort && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            column.toggleSorting();
          }
        }}
      >
        <span className="truncate text-xs font-semibold">{children}</span>
        {canSort && (
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {sortDirection === "asc" ? (
              <ArrowUp className="w-3 h-3" />
            ) : sortDirection === "desc" ? (
              <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-50" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Utility function to create row number column using native TanStack accessor
export const createRowNumberColumn = <TData,>(
  config: BaseTableColumnConfig = {},
): ColumnDef<TData> => {
  return {
    id: "#",
    accessorFn: (_, index) => index + 1, // Use native accessor function
    header: ({ column }) => (
      <SortableHeader column={column}>
        <span className="text-xs">#</span>
      </SortableHeader>
    ),
    cell: ({ getValue, row }) => (
      <div
        id={`row-number-${row.index}`}
        className="h-12 flex items-center px-2 justify-end"
      >
        <span className="text-sm font-mono text-gray-600 font-medium">
          {getValue() as number}
        </span>
      </div>
    ),
    size: config.size || TABLE_DEFAULTS.COLUMN_WIDTH.XSMALL,
    minSize: config.minSize || TABLE_DEFAULTS.COLUMN_LIMITS.MIN_XSMALL,
    maxSize: config.maxSize || TABLE_DEFAULTS.COLUMN_LIMITS.MAX_XSMALL,
    enableResizing: config.enableResizing ?? true,
    enableSorting: config.enableSorting ?? true,
    meta: {
      isRowNumber: true,
    },
  };
};

// Simplified default cell renderer - FIXED hydration issue
export const DefaultCellRenderer = <TData,>({
  value,
  row,
  column,
}: {
  value: unknown;
  row: { index: number };
  column: { id: string };
}) => {
  // Use deterministic ID based on column and row index only - no random member IDs
  const cellId = `cell-${column.id}-${row.index}`;

  return (
    <div id={cellId} className="h-12 flex items-center px-2 justify-start">
      <span
        className="text-sm text-gray-700 truncate w-full overflow-hidden text-ellipsis whitespace-nowrap"
        title={String(value || "")}
      >
        {String(value || "")}
      </span>
    </div>
  );
};

// Simplified utility to create data columns using native TanStack patterns
export const createDataColumn = <TData,>(
  key: keyof TData | string,
  config: BaseTableColumnConfig & {
    header?: string;
    cell?: (props: {
      getValue: () => any;
      row: { original: TData; index: number };
      column: Column<TData, unknown>;
    }) => React.ReactNode;
  } = {},
): ColumnDef<TData> => {
  return {
    id: String(key),
    accessorKey: key as keyof TData,
    header: ({ column }) => (
      <SortableHeader column={column}>
        <span className="text-xs">{config.header || String(key)}</span>
      </SortableHeader>
    ),
    cell:
      config.cell ||
      (({ getValue, row, column }) => (
        <DefaultCellRenderer value={getValue()} row={row} column={column} />
      )),
    size: config.size || TABLE_DEFAULTS.COLUMN_WIDTH.LARGE,
    minSize: config.minSize || TABLE_DEFAULTS.COLUMN_LIMITS.MIN_LARGE,
    maxSize: config.maxSize || TABLE_DEFAULTS.COLUMN_LIMITS.MAX_LARGE,
    enableResizing: config.enableResizing ?? true,
    enableSorting: config.enableSorting ?? true,
  };
};

interface BaseTableProps<TData> {
  table: Table<TData>;
  onScroll?: (scrollTop: number) => void;
  headerClassName?: string;
  containerClassName?: string;
  rowHeight?: number;
  renderFooter?: () => React.ReactNode;
  emptyStateMessage?: string;
  loadingState?: boolean;
}

const BaseTable = React.forwardRef<BaseTableRef, BaseTableProps<any>>(
  <TData,>(
    {
      table,
      onScroll,
      headerClassName = "bg-slate-800",
      containerClassName = "",
      rowHeight = TABLE_DEFAULTS.ROW_HEIGHT,
      renderFooter,
      emptyStateMessage = "No data available",
      loadingState = false,
    }: BaseTableProps<TData>,
    ref: React.Ref<BaseTableRef>,
  ) => {
    const [containerHeight] = useAtom(tableContainerHeightAtom);
    const scrollRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      scrollToOffset: (offset: number) => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = offset;
        }
      },
    }));

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      if (onScroll) {
        onScroll(newScrollTop);
      }
    };

    // Get table data using TanStack's native methods
    const rows = table.getRowModel().rows;
    const headerGroups = table.getHeaderGroups();
    const totalWidth = table.getTotalSize();

    const renderEmptyState = () => (
      <div
        id="table-empty-state"
        className="flex items-center justify-center h-32 text-gray-500"
      >
        <p>{emptyStateMessage}</p>
      </div>
    );

    const renderLoadingState = () => (
      <div
        id="table-loading-state"
        className="flex items-center justify-center h-32"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );

    return (
      <div
        id="base-table-container"
        className={`flex flex-col h-full ${containerClassName}`}
      >
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Fixed Header */}
            <div
              id="table-header"
              className="sticky top-0 z-10 border-b border-gray-200 overflow-hidden"
            >
              <div
                className={`${headerClassName} w-full`}
                style={{
                  minWidth: totalWidth,
                  overflowX: "hidden",
                }}
              >
                {headerGroups.map((headerGroup) => (
                  <div key={headerGroup.id} className="flex w-full">
                    {headerGroup.headers.map((header) => (
                      <div
                        key={header.id}
                        className="text-slate-800 font-semibold px-1 py-3 border-r border-slate-400 relative"
                        style={{
                          width: header.getSize(),
                          minWidth: header.getSize(),
                          height: "56px",
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <div className="h-full flex items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                            {/* Native TanStack column resizer */}
                            {header.column.getCanResize() && (
                              <div
                                className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-slate-500 transition-colors ${
                                  header.column.getIsResizing()
                                    ? "bg-slate-400 opacity-100"
                                    : "bg-slate-600 opacity-0 hover:opacity-100"
                                }`}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                                role="separator"
                                aria-label="Resize column"
                                tabIndex={0}
                                style={{
                                  transform: header.column.getIsResizing()
                                    ? "scaleX(2)"
                                    : "scaleX(1)",
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1">
              <div
                ref={scrollRef}
                id="table-body"
                className="overflow-auto pb-4"
                style={{ height: containerHeight }}
                onScroll={handleScroll}
                role="grid"
                aria-label="Data table"
                aria-rowcount={rows.length}
                aria-colcount={table.getAllColumns().length}
              >
                <div className="w-full" style={{ width: totalWidth }}>
                  {loadingState
                    ? renderLoadingState()
                    : rows.length === 0
                      ? renderEmptyState()
                      : rows.map((row, index) => {
                          const rowClass =
                            index % 2 === 0 ? "bg-white" : "bg-gray-50";

                          return (
                            <div
                              key={row.id}
                              className={`flex border-b border-gray-200 hover:bg-orange-50 transition-colors ${rowClass}`}
                              style={{ height: rowHeight }}
                              role="row"
                              aria-rowindex={index + 2}
                            >
                              {row.getVisibleCells().map((cell, cellIndex) => (
                                <div
                                  key={cell.id}
                                  className="px-1 py-1 flex items-center border-r border-gray-200 last:border-r-0 overflow-hidden"
                                  style={{
                                    width: cell.column.getSize(),
                                    minWidth: cell.column.getSize(),
                                    maxWidth: cell.column.getSize(),
                                  }}
                                  role="gridcell"
                                  aria-colindex={cellIndex + 1}
                                >
                                  <div className="w-full overflow-hidden">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderFooter && (
          <div
            id="table-footer"
            className="flex-shrink-0 border-t border-gray-200"
          >
            {renderFooter()}
          </div>
        )}
      </div>
    );
  },
);

BaseTable.displayName = "BaseTable";

export default BaseTable;
