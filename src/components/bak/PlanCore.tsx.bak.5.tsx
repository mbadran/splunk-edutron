import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Plus, Edit, Check, X, Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import BaseTable, {
  BaseTableRef,
  SortableHeader,
} from "./common/BaseTable";
import { Course, Person } from "@/types/types";
import { DEFAULT_TEAM_NAMES, DEFAULT_TABLE } from "@/utils/constants";
import {
  planTeamMembersAtom,
  planSelectionsAtom,
  planCoursesAtom,
} from "./Planner";

// Local editing state atoms - these don't need to be persisted
import { atom } from "jotai";
const editingMemberAtom = atom<number | null>(null);
const editValueAtom = atom<string>("");

interface PlanCoreProps {
  onScroll?: (scrollTop: number) => void;
}

interface PlanCoreRef {
  scrollToOffset: (offset: number) => void;
}

const MAX_TEAM_MEMBERS = 20;
const MEMBER_COLUMN_WIDTH = DEFAULT_TABLE.COLUMN_WIDTH.MEDIUM;

const PlanCore = forwardRef<PlanCoreRef, PlanCoreProps>(
  ({ onScroll }, ref) => {
    const baseTableRef = useRef<BaseTableRef>(null);

    // Use global Jotai state from Planner
    const [teamMembers, setTeamMembers] = useAtom(planTeamMembersAtom);
    const [selections, setSelections] = useAtom(planSelectionsAtom);
    const [courses] = useAtom(planCoursesAtom);
    
    // Local editing state
    const [editingMember, setEditingMember] = useAtom(editingMemberAtom);
    const [editValue, setEditValue] = useAtom(editValueAtom);

    // Debug logging to track data flow
    React.useEffect(() => {
      console.log("PlanCore - courses from atom:", courses?.length || 0);
      console.log("PlanCore - team members:", teamMembers?.length || 0);
      console.log("PlanCore - sample course:", courses?.[0]?.Name || "No courses");
    }, [courses, teamMembers]);

    useImperativeHandle(ref, () => ({
      scrollToOffset: (offset: number) => {
        baseTableRef.current?.scrollToOffset(offset);
      },
    }));

    // Initialize team members if empty
    React.useEffect(() => {
      if (teamMembers.length === 0) {
        const defaultMember: Person = {
          id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: DEFAULT_TEAM_NAMES[0] || "Team Member 1",
          email: "",
          role: "",
        };
        setTeamMembers([defaultMember]);
      }
    }, [teamMembers.length, setTeamMembers]);

    // Team member management functions
    const handleAddTeamMember = () => {
      if (teamMembers.length >= MAX_TEAM_MEMBERS) return;

      const newMemberName =
        DEFAULT_TEAM_NAMES[teamMembers.length] ||
        `Team Member ${teamMembers.length + 1}`;

      const newMember: Person = {
        id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newMemberName,
        email: "",
        role: "",
      };

      setTeamMembers([...teamMembers, newMember]);
    };

    const handleDeleteTeamMember = (index: number) => {
      if (teamMembers.length <= 1) return;

      const memberToDelete = teamMembers[index];
      const newTeamMembers = teamMembers.filter((_, i) => i !== index);
      setTeamMembers(newTeamMembers);

      // Clean up selections for deleted member
      const newSelections = { ...selections };
      Object.keys(newSelections).forEach((key) => {
        const [courseId, memberId] = key.split("-");
        if (memberId === memberToDelete.id) {
          delete newSelections[key];
        }
      });
      setSelections(newSelections);

      if (editingMember === index) {
        setEditingMember(null);
        setEditValue("");
      } else if (editingMember !== null && editingMember > index) {
        setEditingMember(editingMember - 1);
      }
    };

    const handleUpdateTeamMember = (index: number, newName: string) => {
      const trimmedName = newName.trim();
      if (!trimmedName) return;

      if (
        teamMembers.some(
          (member, i) =>
            i !== index &&
            member.name.toLowerCase() === trimmedName.toLowerCase(),
        )
      ) {
        return;
      }

      const updatedMembers = [...teamMembers];
      updatedMembers[index] = { ...updatedMembers[index], name: trimmedName };
      setTeamMembers(updatedMembers);
    };

    // Editing functions
    const startEditing = (index: number) => {
      setEditingMember(index);
      setEditValue(teamMembers[index]?.name || "");
    };

    const saveEdit = () => {
      if (editValue.trim() && editingMember !== null) {
        handleUpdateTeamMember(editingMember, editValue.trim());
      }
      setEditingMember(null);
      setEditValue("");
    };

    const cancelEdit = () => {
      setEditingMember(null);
      setEditValue("");
    };

    // Selection functions using courseId-memberId format
    const isSelected = (course: Course, member: Person) => {
      const key = `${course.id}-${member.id}`;
      return selections[key] || false;
    };

    const toggleSelection = (course: Course, member: Person) => {
      const key = `${course.id}-${member.id}`;
      const newSelections = {
        ...selections,
        [key]: !selections[key],
      };
      setSelections(newSelections);
    };

    // Selection Cell Component
    const SelectionCell = React.memo(
      ({
        course,
        member,
      }: {
        course: Course;
        member: Person;
      }) => {
        const selected = isSelected(course, member);

        return (
          <div className="h-12 flex items-center justify-center px-2">
            {selected ? (
              <button
                onClick={() => toggleSelection(course, member)}
                className="w-full h-8 flex items-center justify-center text-lg font-bold transition-all duration-200 rounded cursor-pointer bg-emerald-200 text-white hover:bg-emerald-300"
                title={`Remove '${course.Name}' for ${member.name}`}
                aria-label={`Remove '${course.Name}' for ${member.name}`}
              >
                ●
              </button>
            ) : (
              <button
                onClick={() => toggleSelection(course, member)}
                className="w-full h-8 flex items-center justify-center transition-all duration-200 rounded cursor-pointer hover:bg-orange-100"
                title={`Add '${course.Name}' for ${member.name}`}
                aria-label={`Add '${course.Name}' for ${member.name}`}
              >
                {/* Blank when not selected */}
              </button>
            )}
          </div>
        );
      },
    );

    SelectionCell.displayName = "SelectionCell";

    // Team Member Header Component
    const TeamMemberHeader = React.memo(
      ({
        member,
        index,
        totalMembers,
      }: {
        member: Person;
        index: number;
        totalMembers: number;
      }) => {
        const isEditing = editingMember === index;

        if (isEditing) {
          return (
            <div className="flex items-center justify-center gap-1 w-full h-full px-1">
              <input
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
              />
              <div className="flex gap-1">
                <button
                  onClick={saveEdit}
                  className="text-green-300 hover:text-green-100 p-0.5 rounded"
                  title="Save"
                  aria-label="Save changes"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={cancelEdit}
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
              onClick={() => startEditing(index)}
              title={member.name}
            >
              <span className="text-sm font-semibold block truncate">
                {member.name}
              </span>
            </div>

            <div className="flex gap-0.5 opacity-60 hover:opacity-100 transition-opacity ml-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(index);
                }}
                className="p-0.5 hover:bg-slate-600 rounded transition-colors"
                title="Edit name"
                aria-label={`Edit ${member.name} name`}
              >
                <Edit className="w-3 h-3" />
              </button>

              {totalMembers > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTeamMember(index);
                  }}
                  className="p-0.5 hover:bg-slate-600 hover:text-red-300 rounded transition-colors"
                  title="Delete member"
                  aria-label={`Delete ${member.name}`}
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

    // Column configuration using BaseTable utilities
    const columnHelper = createColumnHelper<Course>();

    // Create member columns dynamically
    const memberColumns = teamMembers.map((member, memberIndex) =>
      columnHelper.display({
        id: `member-${member.id}`,
        header: ({ column }) => (
          <SortableHeader column={column} showDragHandle={false}>
            <TeamMemberHeader
              member={member}
              index={memberIndex}
              totalMembers={teamMembers.length}
            />
          </SortableHeader>
        ),
        cell: ({ row }) => (
          <SelectionCell
            course={row.original}
            member={member}
          />
        ),
        size: MEMBER_COLUMN_WIDTH,
        minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_MEDIUM,
        maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_MEDIUM,
        enableResizing: true,
      }),
    );

    // Add member button column
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

    const columns = [...memberColumns, addButtonColumn];

    // Create table using TanStack Table - use courses from atom
    const table = useReactTable({
      data: courses || [], // Use courses from atom with fallback
      columns,
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: true,
      columnResizeMode: "onChange",
    });

    // More informative empty state message
    const emptyStateMessage = 
      !courses || courses.length === 0
        ? "No courses available. Please check that catalogs are loaded."
        : "No courses available for team assignment";

    return (
      <div id="plan-core" className="h-full">
        <BaseTable
          ref={baseTableRef}
          table={table}
          onScroll={onScroll}
          headerClassName="bg-slate-800"
          rowHeight={DEFAULT_TABLE.ROW_HEIGHT}
          emptyStateMessage={emptyStateMessage}
          columnResizeMode="onChange"
        />
      </div>
    );
  },
);

PlanCore.displayName = "PlanCore";

export default PlanCore;