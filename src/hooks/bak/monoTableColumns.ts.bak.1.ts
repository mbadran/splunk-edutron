import React from "react";
import { Plus, Edit, Check, X, Trash2, FileText, ExternalLink } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader, createRowNumberColumn, createDataColumn } from "../common/BaseTable";
import { Course, Person } from "@/types/types";
import { DEFAULT_TABLE, CATEGORY_COLORS, MODE_COLORS, MODE_TOOLTIPS } from "@/utils/constants";
import { interpolateColor, generateCourseUrl, generateDetailsUrl } from "@/utils/tableUtils";
import { MonoTableSelectionHook } from "./useMonoTableSelection";
import { TeamMemberManagementHook } from "./useTeamMemberManagement";

const MEMBER_COLUMN_WIDTH = DEFAULT_TABLE.COLUMN_WIDTH.MEDIUM;
const MAX_TEAM_MEMBERS = 20;

// Selection Cell Component
export const SelectionCell = React.memo(
  ({ 
    course, 
    member, 
    isSelected, 
    onToggle 
  }: { 
    course: Course; 
    member: Person;
    isSelected: boolean;
    onToggle: (course: Course, member: Person) => void;
  }) => {
    return (
      <div className="h-12 flex items-center justify-center px-2">
        {isSelected ? (
          <button
            onClick={() => onToggle(course, member)}
            className="w-full h-8 flex items-center justify-center text-lg font-bold transition-all duration-200 rounded cursor-pointer bg-emerald-300 text-white hover:bg-emerald-400"
            title={`Remove '${course.Name}' for ${member.name}`}
            aria-label={`Remove course ${course.Name} from ${member.name}'s training plan`}
          >
            ●
          </button>
        ) : (
          <button
            onClick={() => onToggle(course, member)}
            className="w-full h-8 flex items-center justify-center transition-all duration-200 rounded cursor-pointer hover:bg-orange-100"
            title={`Add '${course.Name}' for ${member.name}`}
            aria-label={`Add course ${course.Name} to ${member.name}'s training plan`}
          >
            <span className="text-gray-300 text-lg">○</span>
          </button>
        )}
      </div>
    );
  }
);

SelectionCell.displayName = "SelectionCell";

// Team Member Header Component
export const TeamMemberHeader = React.memo(
  ({
    member,
    index,
    totalMembers,
    managementHook,
  }: {
    member: Person;
    index: number;
    totalMembers: number;
    managementHook: TeamMemberManagementHook;
  }) => {
    const { 
      editingMember, 
      editValue, 
      setEditValue, 
      startEditing, 
      saveEdit, 
      cancelEdit,
      handleDeleteTeamMember 
    } = managementHook;
    
    const isEditing = editingMember === index;

    if (isEditing) {
      return (
        <div className="flex items-center justify-center gap-1 w-full h-full px-2">
          <input
            id={`team-member-edit-${index}`}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            className="flex-1 h-6 px-1 text-xs text-white bg-transparent rounded border-none outline-none text-center border-b-2 border-dashed border-white/60"
            autoFocus
            maxLength={30}
            onFocus={(e) => e.target.select()}
            aria-label={`Edit team member name: ${member.name}`}
          />
          <div className="flex gap-1">
            <button
              onClick={saveEdit}
              className="text-green-300 hover:text-green-100 p-0.5 rounded"
              title="Save"
              aria-label="Save team member name changes"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-red-300 hover:text-red-100 p-0.5 rounded"
              title="Cancel"
              aria-label="Cancel editing team member name"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between w-full h-full px-2">
        <div
          className="flex-1 text-center cursor-pointer select-none hover:bg-white/20 rounded px-1 py-0.5 transition-colors min-w-0"
          onClick={() => startEditing(index)}
          title={`Edit ${member.name}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              startEditing(index);
            }
          }}
          aria-label={`Team member: ${member.name}. Click to edit.`}
        >
          <span className="text-xs font-semibold block truncate text-white">
            {member.name}
          </span>
        </div>

        <div className="flex gap-0.5 opacity-60 hover:opacity-100 transition-opacity ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startEditing(index);
            }}
            className="p-0.5 hover:bg-white/20 rounded transition-colors text-white"
            title="Edit name"
            aria-label={`Edit ${member.name}'s name`}
          >
            <Edit className="w-3 h-3" />
          </button>

          {totalMembers > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTeamMember(index);
              }}
              className="p-0.5 hover:bg-white/20 hover:text-red-400 rounded transition-colors text-white"
              title="Delete member"
              aria-label={`Delete ${member.name} from team`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

TeamMemberHeader.displayName = "TeamMemberHeader";

/**
 * Generate course data columns (pinned to the left)
 */
export const generateCourseColumns = (): ColumnDef<Course>[] => [
  // Row number column
  createRowNumberColumn(),

  // Course ID column
  createDataColumn("ID", {
    header: "ID",
    size: DEFAULT_TABLE.COLUMN_WIDTH.SMALL,
    cell: ({ getValue, row }) => (
      <div className="h-12 flex items-center px-2 justify-center">
        <span 
          className="text-sm text-gray-700 font-mono truncate"
          title={getValue() as string}
        >
          {getValue() as string}
        </span>
      </div>
    ),
  }),

  // Course Name column
  createDataColumn("Name", {
    header: "Course",
    size: DEFAULT_TABLE.COLUMN_WIDTH.XXLARGE,
    cell: ({ getValue, row }) => {
      const course = row.original;
      const courseUrl = generateCourseUrl(course);
      
      return (
        <div className="h-12 flex items-center px-2">
          {courseUrl !== '#' ? (
            <a
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium truncate flex items-center gap-1"
              title={`Open ${getValue() as string} in new tab`}
            >
              <span className="truncate">{getValue() as string}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          ) : (
            <span 
              className="text-sm text-orange-600 font-medium truncate"
              title={getValue() as string}
            >
              {getValue() as string}
            </span>
          )}
        </div>
      );
    },
  }),

  // Category column
  createDataColumn("Category", {
    header: "Category",
    size: DEFAULT_TABLE.COLUMN_WIDTH.MEDIUM,
    cell: ({ getValue }) => {
      const category = getValue() as string;
      const colorClass = CATEGORY_COLORS[category] || "bg-gray-500 text-white";
      
      return (
        <div className="h-12 flex items-center px-2 justify-center">
          <span 
            className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
            title={category}
          >
            {category}
          </span>
        </div>
      );
    },
  }),

  // Price column
  createDataColumn("Price", {
    header: "Price",
    size: DEFAULT_TABLE.COLUMN_WIDTH.SMALL,
    cell: ({ getValue }) => {
      const price = getValue() as number;
      return (
        <div className="h-12 flex items-center px-2 justify-center">
          <span className={`text-sm font-semibold ${price === 0 ? 'text-green-600' : 'text-gray-700'}`}>
            {price === 0 ? 'Free' : `$${price}`}
          </span>
        </div>
      );
    },
  }),

  // PDF column
  createDataColumn("PDF", {
    header: "PDF",
    size: DEFAULT_TABLE.COLUMN_WIDTH.XSMALL,
    cell: ({ getValue, row }) => {
      const course = row.original;
      const detailsUrl = generateDetailsUrl(course);
      
      return (
        <div className="h-12 flex items-center px-2 justify-center">
          {detailsUrl !== '#' ? (
            <a
              href={detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 transition-colors"
              title="View course details PDF"
              aria-label={`View ${course.Name} details PDF`}
            >
              <FileText className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-gray-300">
              <FileText className="w-4 h-4" />
            </span>
          )}
        </div>
      );
    },
  }),

  // Mode column
  createDataColumn("Mode", {
    header: "Mode",
    size: DEFAULT_TABLE.COLUMN_WIDTH.SMALL,
    cell: ({ getValue }) => {
      const mode = getValue() as string;
      const colorClass = MODE_COLORS[mode] || "bg-gray-100 text-gray-800";
      const tooltip = MODE_TOOLTIPS[mode] || mode;
      
      return (
        <div className="h-12 flex items-center px-2 justify-center">
          <span 
            className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
            title={tooltip}
          >
            {mode}
          </span>
        </div>
      );
    },
  }),

  // Language column
  createDataColumn("Language", {
    header: "Language",
    size: DEFAULT_TABLE.COLUMN_WIDTH.SMALL,
    cell: ({ getValue }) => (
      <div className="h-12 flex items-center px-2 justify-center">
        <span className="text-sm text-gray-700 font-medium">
          {getValue() as string || 'EN'}
        </span>
      </div>
    ),
  }),

  // Duration column
  createDataColumn("Duration", {
    header: "Duration",
    size: DEFAULT_TABLE.COLUMN_WIDTH.SMALL,
    cell: ({ getValue }) => (
      <div className="h-12 flex items-center px-2 justify-center">
        <span className="text-sm text-gray-700 font-mono">
          {getValue() as number}h
        </span>
      </div>
    ),
  }),
];

/**
 * Generate team member columns (scrollable on the right)
 */
export const generateTeamColumns = (
  teamMembers: Person[],
  selectionHook: MonoTableSelectionHook,
  managementHook: TeamMemberManagementHook
): ColumnDef<Course>[] => {
  const memberColumns = teamMembers.map((member, memberIndex) => {
    // Calculate gradient color for header
    const gradientFactor = teamMembers.length > 1 ? memberIndex / (teamMembers.length - 1) : 0;
    const headerColor = interpolateColor("#000000", "#dddddd", gradientFactor);

    return {
      id: `member-${member.id}`,
      header: ({ column }: any) => (
        <SortableHeader column={column} showDragHandle={false}>
          <div 
            className="w-full h-full -m-1"
            style={{ backgroundColor: headerColor }}
          >
            <TeamMemberHeader
              member={member}
              index={memberIndex}
              totalMembers={teamMembers.length}
              managementHook={managementHook}
            />
          </div>
        </SortableHeader>
      ),
      cell: ({ row }: any) => (
        <SelectionCell 
          course={row.original} 
          member={member}
          isSelected={selectionHook.isSelected(row.original, member)}
          onToggle={selectionHook.handleToggleSelection}
        />
      ),
      size: MEMBER_COLUMN_WIDTH,
      minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_MEDIUM,
      maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_MEDIUM,
      enableResizing: true,
      enableSorting: false,
    };
  });

  // Add member button column with gradient color
  const addButtonColor = teamMembers.length > 0 
    ? interpolateColor("#000000", "#dddddd", 1.0)
    : "#dddddd";

  const addButtonColumn = {
    id: "add-member",
    header: ({ column }: any) => (
      <SortableHeader column={column} showDragHandle={false}>
        <div 
          className="w-full h-full -m-1 flex items-center justify-center"
          style={{ backgroundColor: addButtonColor }}
        >
          <button
            onClick={managementHook.handleAddTeamMember}
            disabled={teamMembers.length >= MAX_TEAM_MEMBERS}
            className={`w-8 h-8 bg-transparent border-none transition-colors rounded flex items-center justify-center font-semibold ${
              teamMembers.length < MAX_TEAM_MEMBERS
                ? "hover:bg-white/20 cursor-pointer text-black"
                : "opacity-50 cursor-not-allowed text-gray-500"
            }`}
            title={
              teamMembers.length < MAX_TEAM_MEMBERS
                ? "Add team member"
                : `Maximum ${MAX_TEAM_MEMBERS} members allowed`
            }
            aria-label={
              teamMembers.length < MAX_TEAM_MEMBERS
                ? "Add new team member to training plan"
                : `Maximum ${MAX_TEAM_MEMBERS} team members allowed`
            }
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </SortableHeader>
    ),
    cell: () => <div className="h-12"></div>,
    size: MEMBER_COLUMN_WIDTH,
    minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_MEDIUM,
    maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_MEDIUM,
    enableResizing: true,
    enableSorting: false,
  };

  return [...memberColumns, addButtonColumn];
};