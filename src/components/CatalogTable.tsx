import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnResizeMode,
  ColumnDef,
} from "@tanstack/react-table";
import { ChevronUp } from "lucide-react";
import { useAtom } from "jotai";

// Updated imports to use enhanced components
import BaseTable2 from "@/components/common/table/BaseTable2";
import { TableHeader } from "@/components/common/table/TableHeader";
import { createColumn, createRowNumberColumn } from "@/utils/table/columnUtils";
import {
  IDCell,
  CategoryCell,
  ModeCell,
  LanguageCell,
  DurationCell,
  CatalogPriceCell,
  NameCell,
  PDFCell,
  RowNumberCell,
} from "@/components/common/table/cellrenderers";
import { useCatalogTable } from "@/hooks/catalog/useCatalogTable";
import { reorderColumns } from "@/utils/table/coreTableHelpers";
import {
  generateCatalogFooterMessage,
  DEFAULT_CATALOG_COLUMN_ORDER,
} from "@/utils/table/catalogTableHelpers";

// FIXED: Import event handlers from CatalogActions instead of direct atoms
import { useCatalogTableEventHandlers } from "@/components/CatalogActions";

import CatalogBase from "./CatalogBase";
import { Course } from "@/types/types";
import { TABLE_DEFAULTS } from "@/utils/constants";

interface CatalogTableProps {
  catalogId?: string;
  onScroll?: (scrollTop: number) => void;
}

// Create enhanced columns with proper JSX headers
const createCourseColumns = (
  onMoveColumn: (columnId: string, direction: "left" | "right") => void,
): ColumnDef<Course>[] => {
  return [
    // Enhanced row number column
    {
      ...createRowNumberColumn<Course>({
        size: TABLE_DEFAULTS.COLUMN_WIDTH.XSMALL,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_XSMALL,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_XSMALL,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          #
        </TableHeader>
      ),
      cell: ({ getValue, row }) => (
        <RowNumberCell getValue={getValue} row={row} />
      ),
    },

    // Enhanced course data columns
    {
      ...createColumn<Course>("ID", {
        header: "ID",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.MEDIUM,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_MEDIUM,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_MEDIUM,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          ID
        </TableHeader>
      ),
      cell: IDCell,
    },

    {
      ...createColumn<Course>("Category", {
        header: "Category",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.MEDIUM,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_MEDIUM,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_MEDIUM,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          Category
        </TableHeader>
      ),
      cell: CategoryCell,
    },

    {
      ...createColumn<Course>("Price", {
        header: "Price",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.MEDIUM,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_MEDIUM,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_MEDIUM,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          Price
        </TableHeader>
      ),
      cell: CatalogPriceCell,
    },

    {
      ...createColumn<Course>("Name", {
        header: "Course",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.HUGE,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_HUGE,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_HUGE,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          Course
        </TableHeader>
      ),
      cell: NameCell,
    },

    {
      ...createColumn<Course>("PDF", {
        header: "PDF",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.XSMALL,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_XSMALL,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_XSMALL,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          PDF
        </TableHeader>
      ),
      cell: PDFCell,
    },

    {
      ...createColumn<Course>("Mode", {
        header: "Mode",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.SMALL,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_SMALL,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_SMALL,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          Mode
        </TableHeader>
      ),
      cell: ModeCell,
    },

    {
      ...createColumn<Course>("Language", {
        header: "Language",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.SMALL,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_SMALL,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_SMALL,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          Language
        </TableHeader>
      ),
      cell: LanguageCell,
    },

    {
      ...createColumn<Course>("Duration", {
        header: "Duration",
        size: TABLE_DEFAULTS.COLUMN_WIDTH.SMALL,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_SMALL,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_SMALL,
        showMoveHandle: true,
        onMoveColumn,
      }),
      header: ({ column }) => (
        <TableHeader
          column={column}
          className="text-sm font-bold text-white"
          showMoveHandle={true}
          onMoveColumn={onMoveColumn}
        >
          Duration
        </TableHeader>
      ),
      cell: DurationCell,
    },
  ];
};

// Enhanced inner table component
const CatalogTableInner: React.FC<{
  courses: Course[];
  isLoading: boolean;
  error: unknown;
  onScroll?: (scrollTop: number) => void;
}> = ({ courses, isLoading, error, onScroll }) => {
  // FIXED: Use event handlers from CatalogActions instead of direct state management
  const tableEventHandlers = useCatalogTableEventHandlers();
  
  const tableRef = React.useRef<{ scrollToTop: () => void }>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Get reset functionality
  const { resetTableState } = useCatalogTable();

  // Column move handler
  const handleMoveColumn = React.useCallback(
    (draggedColumnId: string, direction: "left" | "right") => {
      const currentOrder =
        tableEventHandlers.columnOrder.length > 0 ? tableEventHandlers.columnOrder : DEFAULT_CATALOG_COLUMN_ORDER;
      const newOrder = reorderColumns(currentOrder, draggedColumnId, direction);

      if (newOrder !== currentOrder) {
        console.log(`Moving column ${draggedColumnId} ${direction}:`, newOrder);
        // FIXED: Use event handler with history tracking
        tableEventHandlers.onColumnOrderChange(newOrder);
      }
    },
    [tableEventHandlers],
  );

  // Create enhanced columns
  const columns = createCourseColumns(handleMoveColumn);

  const table = useReactTable({
    data: courses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnFilters: true,
    enableColumnOrdering: true,
    state: {
      // FIXED: Use state from event handlers
      sorting: tableEventHandlers.sorting,
      columnFilters: tableEventHandlers.columnFilters,
      columnOrder: tableEventHandlers.columnOrder.length > 0 ? tableEventHandlers.columnOrder : undefined,
    },
    // FIXED: Use event handlers with history tracking
    onSortingChange: tableEventHandlers.onSortingChange,
    onColumnFiltersChange: tableEventHandlers.onColumnFiltersChange,
    onColumnOrderChange: tableEventHandlers.onColumnOrderChange,
    columnResizeMode: "onChange" as ColumnResizeMode,
    enableColumnResizing: true,
    enableSorting: !isLoading && !error,
  });

  // Handle scroll events
  const handleScroll = (scrollTop: number) => {
    setShowScrollTop(scrollTop > 200);
    if (onScroll) {
      onScroll(scrollTop);
    }
  };

  // Handle loading and error states
  if (isLoading || error) {
    return null; // CatalogBase handles these states
  }

  // Generate footer message
  const totalCourses = courses.length;
  const filteredCourses = table.getFilteredRowModel().rows.length;
  const footerMessage = generateCatalogFooterMessage(
    filteredCourses,
    totalCourses,
  );

  return (
    <div className="h-full relative">
      <BaseTable2
        ref={tableRef}
        table={table}
        onScroll={handleScroll}
        containerHeight="100%"
        headerClassName="bg-gray-600 border-b border-gray-500"
        bodyClassName="divide-y divide-gray-200"
        emptyStateMessage="No courses available"
        loadingState={false}
        footerMessage={footerMessage}
        enableAlternatingRows={true}
      />

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => tableRef.current?.scrollToTop()}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50 hover:scale-105"
          title="Scroll to top"
          aria-label="Scroll to top of table"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const CatalogTable: React.FC<CatalogTableProps> = ({ catalogId, onScroll }) => {
  return (
    <div className="h-full">
      <CatalogBase catalogId={catalogId}>
        {({ courses, isLoading, error }) => (
          <CatalogTableInner
            courses={courses}
            isLoading={isLoading}
            error={error}
            onScroll={onScroll}
          />
        )}
      </CatalogBase>
    </div>
  );
};

export default CatalogTable;