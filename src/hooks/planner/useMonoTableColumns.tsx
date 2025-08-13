import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useAtom } from "jotai";

// Updated imports to use shared cell renderers
import { createColumn, createRowNumberColumn } from "@/utils/table/columnUtils";
import { TableHeader } from "@/components/common/table/TableHeader";
import { TeamMemberHeader } from "@/components/common/table/TeamMemberHeader";
import {
  IDCell,
  CategoryCell,
  ModeCell,
  LanguageCell,
  DurationCell,
  NameCell,
  PDFCell,
  RowNumberCell,
  PlanCell,
} from "@/components/common/table/cellrenderers";

import { Course, Person } from "@/types/types";
import { TABLE_DEFAULTS } from "@/utils/constants";
import { generateTeamMemberColumnId } from "@/utils/table/planTableHelpers";
import { MonoTableSelectionHook } from "@/hooks/planner/useMonoTableSelection";
import { TeamMemberManagementHook } from "@/hooks/planner/useTeamMemberManagement";
import { isCreditsUnitModeAtom } from "@/atoms/globalAtoms";

export interface UseMonoTableColumnsHook {
  courseColumns: ColumnDef<Course>[];
  teamColumns: ColumnDef<Course>[];
  allColumns: ColumnDef<Course>[];
}

// MonoTable-specific price cell with TU support
const MonoTablePriceCell = ({ getValue }: any) => {
  const [isCreditsMode] = useAtom(isCreditsUnitModeAtom);
  const price = Number(getValue());

  // Handle free courses
  if (price === 0) {
    return (
      <div className="h-12 flex items-center px-2 justify-center">
        <span className="text-sm font-semibold text-green-600">
          Free
        </span>
      </div>
    );
  }

  // Convert to TUs if in credits mode (1 TU = $10)
  const displayPrice = isCreditsMode ? price / 10 : price;
  const currencySymbol = isCreditsMode ? "" : "$";

  // Format the number
  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayPrice);

  return (
    <div className="h-12 flex items-center px-2 justify-center">
      <span className="text-sm font-semibold text-gray-700">
        {currencySymbol}{formattedPrice}
      </span>
    </div>
  );
};

/**
 * Hook for creating MonoTable column definitions using shared cell renderers
 */
export const useMonoTableColumns = (
  teamMembers: Person[],
  selectionHook: MonoTableSelectionHook,
  managementHook: TeamMemberManagementHook,
  onMoveColumn?: (columnId: string, direction: "left" | "right") => void,
): UseMonoTableColumnsHook => {

  // Create course data columns using shared renderers and proper headers
  const courseColumns = useMemo(
    (): ColumnDef<Course>[] => [
      // Row number column with proper header
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
            className="text-sm font-semibold text-white"
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

      // Course ID column
      {
        ...createColumn<Course>("ID", {
          header: "ID",
          size: TABLE_DEFAULTS.COLUMN_WIDTH.SMALL,
          minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_SMALL,
          maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_SMALL,
          showMoveHandle: true,
          onMoveColumn,
        }),
        header: ({ column }) => (
          <TableHeader
            column={column}
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            ID
          </TableHeader>
        ),
        cell: IDCell,
      },

      // Course Name column
      {
        ...createColumn<Course>("Name", {
          header: "Course",
          size: TABLE_DEFAULTS.COLUMN_WIDTH.XXLARGE,
          minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_XXLARGE,
          maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_XXLARGE,
          showMoveHandle: true,
          onMoveColumn,
        }),
        header: ({ column }) => (
          <TableHeader
            column={column}
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            Course
          </TableHeader>
        ),
        cell: NameCell,
      },

      // Category column
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
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            Category
          </TableHeader>
        ),
        cell: CategoryCell,
      },

      // Price column with TU support
      {
        ...createColumn<Course>("Price", {
          header: "Price",
          size: TABLE_DEFAULTS.COLUMN_WIDTH.SMALL,
          minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_SMALL,
          maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_SMALL,
          showMoveHandle: true,
          onMoveColumn,
        }),
        header: ({ column }) => (
          <TableHeader
            column={column}
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            Price
          </TableHeader>
        ),
        cell: MonoTablePriceCell,
      },

      // PDF column
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
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            PDF
          </TableHeader>
        ),
        cell: PDFCell,
      },

      // Mode column
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
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            Mode
          </TableHeader>
        ),
        cell: ModeCell,
      },

      // Language column
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
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            Language
          </TableHeader>
        ),
        cell: LanguageCell,
      },

      // Duration column
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
            className="text-sm font-semibold text-white"
            showMoveHandle={true}
            onMoveColumn={onMoveColumn}
          >
            Duration
          </TableHeader>
        ),
        cell: DurationCell,
      },
    ],
    [onMoveColumn],
  );

  // Create team member columns with enhanced headers and binary filtering
  const teamColumns = useMemo((): ColumnDef<Course>[] => {
    const memberColumns = teamMembers.map((member, memberIndex) => {
      const columnId = generateTeamMemberColumnId(member.id);

      return {
        id: columnId,
        header: ({ column }: any) => (
          <TeamMemberHeader
            column={column}
            member={member}
            index={memberIndex}
            totalMembers={teamMembers.length}
            managementHook={managementHook}
            onMoveColumn={onMoveColumn}
          />
        ),
        cell: ({ row }: any) => (
          <PlanCell
            course={row.original}
            member={member}
            isSelected={selectionHook.isSelected(row.original, member)}
            onToggle={selectionHook.handleToggleSelection}
          />
        ),
        // Custom filter function for binary selection filtering
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === "selected") {
            // Show only rows where this member has selected this course
            const course = row.original;
            return selectionHook.isSelected(course, member);
          }
          return true; // Show all rows when not filtered
        },
        size: TABLE_DEFAULTS.COLUMN_WIDTH.MEDIUM,
        minSize: TABLE_DEFAULTS.COLUMN_LIMITS.MIN_MEDIUM,
        maxSize: TABLE_DEFAULTS.COLUMN_LIMITS.MAX_MEDIUM,
        enableResizing: true,
        enableSorting: true, // Enable sorting by selection state
        enableColumnFilter: true, // Enable binary filtering
        // Custom sort function for selection state
        sortingFn: (rowA, rowB, columnId) => {
          const courseA = rowA.original;
          const courseB = rowB.original;
          const selectedA = selectionHook.isSelected(courseA, member) ? 1 : 0;
          const selectedB = selectionHook.isSelected(courseB, member) ? 1 : 0;
          return selectedA - selectedB;
        },
      };
    });

    return memberColumns;
  }, [teamMembers, selectionHook, managementHook, onMoveColumn]);

  // Combine all columns
  const allColumns = useMemo(
    () => [...courseColumns, ...teamColumns],
    [courseColumns, teamColumns],
  );

  return {
    courseColumns,
    teamColumns,
    allColumns,
  };
};