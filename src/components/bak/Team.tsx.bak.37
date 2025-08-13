import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Plus, Edit, Check, X, Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import BaseTable, { BaseTableRef, SortableHeader } from "./common/BaseTable";
import { Course } from "./types";
import { DEFAULT_TEAM_NAMES, DEFAULT_TABLE } from "./constants";
import TeamInsights from "./TeamInsights";
import { useRenderDebugger } from "./hooks/rendering";

interface TeamProps {
  courses: Course[];
  onScroll?: (scrollOffset: number) => void;
}

interface SelectionCellProps {
  courseIndex: number;
  memberIndex: number;
  isSelected: boolean;
  onToggle: () => void;
  courseName: string;
  memberName: string;
}

interface TeamMemberHeaderProps {
  member: string;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editValue: string;
  onEditChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  totalMembers: number;
}

interface TeamRef {
  scrollToOffset: (offset: number) => void;
}

const MAX_TEAM_MEMBERS = 20;
const MEMBER_COLUMN_WIDTH = DEFAULT_TABLE.COLUMN_WIDTH.MEDIUM;

const SelectionCell: React.FC<SelectionCellProps> = React.memo(
  ({
    courseIndex,
    memberIndex,
    isSelected,
    onToggle,
    courseName,
    memberName,
  }) => {
    // Simplified debug logging
    const debugInfo = useRenderDebugger(
      "SelectionCell",
      {
        courseIndex,
        memberIndex,
        isSelected,
      },
      {
        maxRenderWarning: 50,
        logLevel: "none",
      },
    );

    // Circuit breaker for excessive renders
    if (debugInfo.isCritical) {
      return (
        <div className="h-12 flex items-center justify-center px-2 bg-red-100">
          <span className="text-xs text-red-600">Render Error</span>
        </div>
      );
    }

    return (
      <div className="h-12 flex items-center justify-center px-2">
        {isSelected ? (
          <button
            onClick={onToggle}
            className="w-full h-8 flex items-center justify-center text-lg font-bold transition-all duration-200 rounded cursor-pointer bg-emerald-200 text-white hover:bg-emerald-300"
            title={`Remove '${courseName}' for ${memberName}`}
            aria-label={`Remove '${courseName}' for ${memberName}`}
          >
            ●
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="w-full h-8 flex items-center justify-center transition-all duration-200 rounded cursor-pointer hover:bg-orange-100"
            title={`Add '${courseName}' for ${memberName}`}
            aria-label={`Add '${courseName}' for ${memberName}`}
          >
            {/* Completely blank when not selected */}
          </button>
        )}
      </div>
    );
  },
);

SelectionCell.displayName = "SelectionCell";

const TeamMemberHeader: React.FC<TeamMemberHeaderProps> = React.memo(
  ({
    member,
    index,
    onEdit,
    onDelete,
    isEditing,
    editValue,
    onEditChange,
    onSave,
    onCancel,
    totalMembers,
  }) => {
    // Simplified debug logging
    const debugInfo = useRenderDebugger(
      "TeamMemberHeader",
      {
        member,
        index,
        isEditing,
      },
      {
        maxRenderWarning: 50,
        logLevel: "none",
      },
    );

    // Circuit breaker for excessive renders
    if (debugInfo.isCritical) {
      return (
        <div className="flex items-center justify-center w-full h-full px-1 bg-red-100">
          <span className="text-xs text-red-600">Header Error</span>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="flex items-center justify-center gap-1 w-full h-full px-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") onCancel();
            }}
            className="flex-1 h-6 px-1 text-xs text-white bg-transparent rounded border-none outline-none text-center border-b-2 border-dashed border-white/60"
            autoFocus
            maxLength={30}
            onFocus={(e) => e.target.select()}
          />
          <div className="flex gap-1">
            <button
              onClick={onSave}
              className="text-green-300 hover:text-green-100 p-0.5 rounded"
              title="Save"
              aria-label="Save changes"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={onCancel}
              className="text-red-300 hover:text-red-100 p-0.5 rounded"
              title="Cancel"
              aria-label="Cancel editing"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between w-full h-full px-1">
        <div
          className="flex-1 text-center cursor-pointer select-none hover:bg-slate-700/50 rounded px-1 py-0.5 transition-colors min-w-0"
          onClick={onEdit}
          title={member}
        >
          <span className="text-sm font-semibold block truncate">{member}</span>
        </div>

        <div className="flex gap-0.5 opacity-60 hover:opacity-100 transition-opacity ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-0.5 hover:bg-slate-600 rounded transition-colors"
            title="Edit name"
            aria-label={`Edit ${member} name`}
          >
            <Edit className="w-3 h-3" />
          </button>

          {totalMembers > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-0.5 hover:bg-slate-600 hover:text-red-300 rounded transition-colors"
              title="Delete member"
              aria-label={`Delete ${member}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

TeamMemberHeader.displayName = "TeamMemberHeader";

const Team = forwardRef<TeamRef, TeamProps>(
  ({ courses = [], onScroll }, ref) => {
    // Simplified debug logging
    const debugInfo = useRenderDebugger(
      "Team",
      {
        coursesLength: courses.length,
      },
      {
        maxRenderWarning: 30,
        logLevel: "basic",
      },
    );

    // Internal state management - no external dependencies
    const [teamMembers, setTeamMembers] = useState<string[]>(() => [
      DEFAULT_TEAM_NAMES[0] || "Team Member 1",
    ]);
    const [selections, setSelections] = useState<Record<string, boolean>>({});
    const [editingMember, setEditingMember] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    const baseTableRef = useRef<BaseTableRef>(null);

    // Circuit breaker for excessive renders
    if (debugInfo.isCritical) {
      return (
        <div className="h-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center p-4">
            <div className="text-red-600 font-semibold mb-2">
              Component Error
            </div>
            <div className="text-sm text-red-500">
              Team component has rendered too many times. Please refresh the
              page.
            </div>
          </div>
        </div>
      );
    }

    useImperativeHandle(ref, () => ({
      scrollToOffset: (offset: number) => {
        baseTableRef.current?.scrollToOffset(offset);
      },
    }));

    // Simplified selection handling
    const isSelected = useCallback(
      (courseIndex: number, memberIndex: number) => {
        const key = `${courseIndex}-${memberIndex}`;
        return selections[key] || false;
      },
      [selections],
    );

    const toggleSelection = useCallback(
      (courseIndex: number, memberIndex: number) => {
        const key = `${courseIndex}-${memberIndex}`;
        setSelections((prev) => ({
          ...prev,
          [key]: !prev[key],
        }));
      },
      [],
    );

    // Simplified team member management
    const handleAddTeamMember = useCallback(() => {
      if (teamMembers.length >= MAX_TEAM_MEMBERS) return;

      const newMemberName =
        DEFAULT_TEAM_NAMES[teamMembers.length] ||
        `Team Member ${teamMembers.length + 1}`;
      setTeamMembers((prev) => [...prev, newMemberName]);
    }, [teamMembers.length]);

    const handleDeleteTeamMember = useCallback(
      (index: number) => {
        if (teamMembers.length <= 1) return;

        setTeamMembers((prev) => prev.filter((_, i) => i !== index));

        // Clean up selections for deleted member
        setSelections((prev) => {
          const newSelections = { ...prev };
          Object.keys(newSelections).forEach((key) => {
            const [, memberIdx] = key.split("-");
            if (parseInt(memberIdx) === index) {
              delete newSelections[key];
            } else if (parseInt(memberIdx) > index) {
              // Adjust indices for members after deleted one
              const [courseIdx] = key.split("-");
              const newKey = `${courseIdx}-${parseInt(memberIdx) - 1}`;
              newSelections[newKey] = newSelections[key];
              delete newSelections[key];
            }
          });
          return newSelections;
        });

        if (editingMember === index) {
          setEditingMember(null);
          setEditValue("");
        } else if (editingMember !== null && editingMember > index) {
          setEditingMember(editingMember - 1);
        }
      },
      [teamMembers.length, editingMember],
    );

    const handleUpdateTeamMember = useCallback(
      (index: number, newName: string) => {
        const trimmedName = newName.trim();
        if (!trimmedName) return;

        if (
          teamMembers.some(
            (name, i) =>
              i !== index && name.toLowerCase() === trimmedName.toLowerCase(),
          )
        ) {
          return;
        }

        setTeamMembers((prev) => {
          const updated = [...prev];
          updated[index] = trimmedName;
          return updated;
        });
      },
      [teamMembers],
    );

    // Simplified editing functions
    const startEditing = useCallback(
      (index: number) => {
        setEditingMember(index);
        setEditValue(teamMembers[index]);
      },
      [teamMembers],
    );

    const saveEdit = useCallback(() => {
      if (editValue.trim() && editingMember !== null) {
        handleUpdateTeamMember(editingMember, editValue.trim());
      }
      setEditingMember(null);
      setEditValue("");
    }, [editValue, editingMember, handleUpdateTeamMember]);

    const cancelEdit = useCallback(() => {
      setEditingMember(null);
      setEditValue("");
    }, []);

    const columnHelper = createColumnHelper<Course>();

    // Simplified column creation
    const columns: ColumnDef<Course, any>[] = useMemo(() => {
      const memberColumns = teamMembers.map((member, memberIndex) =>
        columnHelper.display({
          id: `member-${memberIndex}`,
          header: ({ column }) => (
            <SortableHeader column={column} showDragHandle={false}>
              <TeamMemberHeader
                member={member}
                index={memberIndex}
                totalMembers={teamMembers.length}
                isEditing={editingMember === memberIndex}
                editValue={editValue}
                onEdit={() => startEditing(memberIndex)}
                onDelete={() => handleDeleteTeamMember(memberIndex)}
                onEditChange={setEditValue}
                onSave={saveEdit}
                onCancel={cancelEdit}
              />
            </SortableHeader>
          ),
          cell: ({ row }) => (
            <SelectionCell
              courseIndex={row.index}
              memberIndex={memberIndex}
              isSelected={isSelected(row.index, memberIndex)}
              onToggle={() => toggleSelection(row.index, memberIndex)}
              courseName={row.original.Name}
              memberName={member}
            />
          ),
          size: MEMBER_COLUMN_WIDTH,
          minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_MEDIUM,
          maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_MEDIUM,
          enableResizing: true,
        }),
      );

      const addButtonColumn = columnHelper.display({
        id: "add-member",
        header: ({ column }) => (
          <SortableHeader column={column} showDragHandle={false}>
            <div className="w-full h-full flex items-center justify-center">
              <button
                onClick={handleAddTeamMember}
                disabled={teamMembers.length >= MAX_TEAM_MEMBERS}
                className={`w-8 h-8 bg-transparent border-none text-white transition-colors rounded flex items-center justify-center font-semibold ${
                  teamMembers.length < MAX_TEAM_MEMBERS
                    ? "hover:bg-slate-700 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                title={
                  teamMembers.length < MAX_TEAM_MEMBERS
                    ? "Add team member"
                    : `Maximum ${MAX_TEAM_MEMBERS} members allowed`
                }
                aria-label={
                  teamMembers.length < MAX_TEAM_MEMBERS
                    ? "Add new team member"
                    : `Maximum ${MAX_TEAM_MEMBERS} members allowed`
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
      });

      return [...memberColumns, addButtonColumn];
    }, [
      teamMembers,
      editingMember,
      editValue,
      columnHelper,
      startEditing,
      handleDeleteTeamMember,
      saveEdit,
      cancelEdit,
      isSelected,
      toggleSelection,
      handleAddTeamMember,
    ]);

    const table = useReactTable({
      data: courses,
      columns,
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: true,
      columnResizeMode: "onChange",
    });

    const renderFooter = useCallback(() => {
      return <TeamInsights />;
    }, []);

    const emptyStateMessage = useMemo(() => {
      if (courses.length === 0) {
        return "No courses loaded. Please ensure courses are available from the Catalog.";
      }
      return "No courses available for team assignment";
    }, [courses.length]);

    return (
      <BaseTable
        ref={baseTableRef}
        table={table}
        onScroll={onScroll}
        headerClassName="bg-slate-800"
        rowHeight={DEFAULT_TABLE.ROW_HEIGHT}
        renderFooter={renderFooter}
        emptyStateMessage={emptyStateMessage}
        columnResizeMode="onChange"
      />
    );
  },
);

Team.displayName = "Team";

export default Team;
