import { ColumnDef } from "@tanstack/react-table";

// Base column configuration interface
export interface BaseColumnConfig {
  size?: number;
  minSize?: number;
  maxSize?: number;
  enableSorting?: boolean;
  enableResizing?: boolean;
  enableColumnFilter?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  showMoveHandle?: boolean;
  onMoveColumn?: (columnId: string, direction: 'left' | 'right') => void;
}

// Pure TypeScript utility to create standard table columns
export function createColumn<TData>(
  key: keyof TData | string,
  config: BaseColumnConfig & {
    header?: string;
    cell?: any;
  } = {}
): ColumnDef<TData> {
  return {
    id: String(key),
    accessorKey: key as keyof TData,
    header: config.header || String(key),
    cell: config.cell,
    size: config.size || 150,
    minSize: config.minSize || 100,
    maxSize: config.maxSize || 300,
    enableResizing: config.enableResizing ?? true,
    enableSorting: config.enableSorting ?? true,
    enableColumnFilter: config.enableColumnFilter ?? true,
    meta: {
      headerClassName: config.headerClassName,
      cellClassName: config.cellClassName,
      showMoveHandle: config.showMoveHandle,
      onMoveColumn: config.onMoveColumn,
    },
  };
}

// Pure TypeScript row number column utility
export function createRowNumberColumn<TData>(
  config: BaseColumnConfig = {}
): ColumnDef<TData> {
  return {
    id: "#",
    accessorFn: (_, index) => index + 1,
    header: "#",
    cell: ({ getValue }) => String(getValue()),
    size: config.size || 60,
    minSize: config.minSize || 40,
    maxSize: config.maxSize || 80,
    enableResizing: config.enableResizing ?? true,
    enableSorting: config.enableSorting ?? true,
    enableColumnFilter: false, // Row numbers don't need filtering
    meta: {
      isRowNumber: true,
      headerClassName: config.headerClassName,
      cellClassName: config.cellClassName,
      showMoveHandle: config.showMoveHandle,
      onMoveColumn: config.onMoveColumn,
    },
  };
}