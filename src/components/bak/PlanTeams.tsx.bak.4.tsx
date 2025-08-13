import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Plus, Edit, Check, X, Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import BaseTable, { SortableHeader } from "./common/BaseTable";
import { Course, Person } from "@/types/types";
import { DEFAULT_TEAM_NAMES, DEFAULT_TABLE } from "@/utils/constants";
import {
  plannerCoursesAtom,
  planStateAtom,
  editingTeamMemberAtom,
  editingTeamMemberValueAtom,
  addTeamMemberAtom,
  updateTeamMemberAtom,
  deleteTeamMemberAtom,
  toggleSelectionAtom,
  createPlanSelectionKey,
  setStatusAtom,
} from "@/atoms/globalAtoms";

interface PlanTeamsProps {
  onScroll?: (scrollTop: number) => void;
}

export interface PlanTeamsRef {
  scrollToOffset: (offset: number) => void;
}

const MAX_TEAM_MEMBERS = 20;
const MEMBER_COLUMN_WIDTH = DEFAULT_TABLE.COLUMN_WIDTH.MEDIUM;

const PlanTeams = forwardRef<PlanTeamsRef, PlanTeamsProps>(
  ({ onScroll }, ref) => {
    const baseTableRef = useRef<any>(null);

    // Use global Jotai state exclusively
    const [planState] = useAtom(planStateAtom);
    const [courses] = useAtom(plannerCoursesAtom);
    const [editingMember, setEditingMember] = useAtom(editingTeamMemberAtom);
    const [editValue, setEditValue] = useAtom(editingTeamMemberValueAtom);
    const [, addTeamMember] = useAtom(addTeamMemberAtom);
    const [, updateTeamMember] = useAtom(updateTeamMemberAtom);
    const [, deleteTeamMember] = useAtom(deleteTeamMemberAtom);
    const [, toggleSelection] = useAtom(toggleSelectionAtom);
    const [, setStatus] = useAtom(setStatusAtom);

    // Debug logging to track data flow
    React.useEffect(() => {
      console.log("PlanTeams - courses from atom:", courses?.length || 0);
      console.log(
        "PlanTeams - team members:",
        planState.teamMembers?.length || 0,
      );
      console.log(
        "PlanTeams - selections:",
        Object.keys(planState.selections).length,
      );
      console.log(
        "PlanTeams - sample course:",
        courses?.[0]?.Name || "No courses",
      );
    }, [courses, planState.teamMembers, planState.selections]);

    useImperativeHandle(ref, () => ({
      scrollToOffset: (offset: number) => {
        baseTableRef.current?.scrollToOffset?.(offset);
      },
    }));

    // Initialize team members if empty
    React.useEffect(() => {
      if (planState.teamMembers.length === 0) {
        const defaultMember: Person = {
          id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: DEFAULT_TEAM_NAMES[0] || "Team Member 1",
          email: "",
          role: "",
        };
        addTeamMember(defaultMember);
      }
    }, [planState.teamMembers.length, addTeamMember]);

    // Team member management functions
    const handleAddTeamMember = () => {
      if (planState.teamMembers.length >= MAX_TEAM_MEMBERS) {
        setStatus({ isWorking: false, message: `Maximum ${MAX_TEAM_MEMBERS} members allowed` });
        return;
      }

      const newMemberName =
        DEFAULT_TEAM_NAMES[planState.teamMembers.length] ||
        `Team Member ${planState.teamMembers.length + 1}`;

      const newMember: Person = {
        id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newMemberName,
        email: "",
        role: "",
      };

      addTeamMember(newMember);
    };

    const handleDeleteTeamMember = (index: number) => {
      if (planState.teamMembers.length <= 1) {
        setStatus({ isWorking: false, message: "Cannot delete the last team member" });
        return;
      }

      deleteTeamMember(index);
    };

    const handleUpdateTeamMember = (index: number, newName: string) => {
      const trimmedName = newName.trim();
      if (!trimmedName) {
        setStatus({ isWorking: false, message: "Team member name cannot be empty" });
        return;
      }

      if (
        planState.teamMembers.some(
          (member, i) =>
            i !== index &&
            member.name.toLowerCase() === trimmedName.toLowerCase(),
        )
      ) {
        setStatus({ isWorking: false, message: "Team member name already exists" });
        return;
      }

      const oldMember = planState.teamMembers[index];
      
      // Handle selection key updates in the atom action
      updateTeamMember({ 
        index, 
        updates: { name: trimmedName },
        // Pass old name for selection key cleanup
        oldName: oldMember.name 
      });
    };

    // Editing functions
    const startEditing = (index: number) => {
      setStatus({ isWorking: true, message: "Editing team member..." });
      setEditingMember(index);
      setEditValue(planState.teamMembers[index]?.name || "");
      setStatus({ isWorking: false, message: "" });
    };

    const saveEdit = () => {
      if (editValue.trim() && editingMember !== null) {
        handleUpdateTeamMember(editingMember, editValue.trim());
      } else {
        setEditingMember(null);
        setEditValue("");
      }
    };

    const cancelEdit = () => {
      setEditingMember(null);
      setEditValue("");
    };

    // Selection functions using person-name_course-id format
    const isSelected = (course: Course, member: Person) => {
      const key = createPlanSelectionKey(member.name, course.ID);
      return planState.selections[key] || false;
    };

    const handleToggleSelection = (course: Course, member: Person) => {
      toggleSelection({ course, member });
    };

    // Selection Cell Component
    const SelectionCell = React.memo(
      ({ course, member }: { course: Course; member: Person }) => {
        const selected = isSelected(course, member);

        return (
          <div className="h-12 flex items-center justify-center px-2">
            {selected ? (
              <button
                onClick={() => handleToggleSelection(course, member)}
                className="w-full h-8 flex items-center justify-center text-lg font-bold transition-all duration-200 rounded cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600"
                title={`Remove '${course.Name}' for ${member.name}`}
                aria-label={`Remove course ${course.Name} from ${member.name}'s training plan`}
              >
                ●
              </button>
            ) : (
              <button
                onClick={() => handleToggleSelection(course, member)}
                className="w-full h-8 flex items-center justify-center transition-all duration-200 rounded cursor-pointer hover:bg-orange-100"
                title={`Add '${course.Name}' for ${member.name}`}
                aria-label={`Add course ${course.Name} to ${member.name}'s training plan`}
              >
                {/* Empty circle when not selected - removed border styling */}
                <span className="text-gray-300 text-lg">○</span>
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
          <div className="flex items-center justify-between w-full h-full px-1">
            <div
              className="flex-1 text-center cursor-pointer select-none hover:bg-slate-700/50 rounded px-1 py-0.5 transition-colors min-w-0"
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
                  className="p-0.5 hover:bg-slate-600 hover:text-red-300 rounded transition-colors"
                  title="Delete member"
                  aria-label={`Delete ${member.name} from team`}
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

    // Create columns using native TanStack patterns
    const columnHelper = createColumnHelper<Course>();

    // Create member columns dynamically using native TanStack column definitions
    const memberColumns: ColumnDef<Course>[] = planState.teamMembers.map((member, memberIndex) => ({
      id: `member-${member.id}`,
      header: ({ column }) => (
        <SortableHeader column={column} showDragHandle={false}>
          <TeamMemberHeader
            member={member}
            index={memberIndex}
            totalMembers={planState.teamMembers.length}
          />
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <SelectionCell course={row.original} member={member} />
      ),
      size: MEMBER_COLUMN_WIDTH,
      minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_MEDIUM,
      maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_MEDIUM,
      enableResizing: true,
      enableSorting: false, // Selection columns don't need sorting
    }));

    // Add member button column using native TanStack pattern
    const addButtonColumn: ColumnDef<Course> = {
      id: "add-member",
      header: ({ column }) => (
        <SortableHeader column={column} showDragHandle={false}>
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={handleAddTeamMember}
              disabled={planState.teamMembers.length >= MAX_TEAM_MEMBERS}
              className={`w-8 h-8 bg-transparent border-none text-white transition-colors rounded flex items-center justify-center font-semibold ${
                planState.teamMembers.length < MAX_TEAM_MEMBERS
                  ? "hover:bg-slate-700 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
              title={
                planState.teamMembers.length < MAX_TEAM_MEMBERS
                  ? "Add team member"
                  : `Maximum ${MAX_TEAM_MEMBERS} members allowed`
              }
              aria-label={
                planState.teamMembers.length < MAX_TEAM_MEMBERS
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

    const columns = [...memberColumns, addButtonColumn];

    // Create table using native TanStack Table
    const table = useReactTable({
      data: courses || [], // Use courses from atom with fallback
      columns,
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: true,
      columnResizeMode: "onChange",
      enableSorting: false, // Team columns don't need sorting
    });

    // More informative empty state message
    const emptyStateMessage =
      !courses || courses.length === 0
        ? "No courses available. Please check that catalogs are loaded."
        : "No courses available for team assignment";

    return (
      <div id="plan-teams" className="h-full">
        <BaseTable
          ref={baseTableRef}
          table={table}
          onScroll={onScroll}
          headerClassName="bg-slate-800"
          rowHeight={DEFAULT_TABLE.ROW_HEIGHT}
          emptyStateMessage={emptyStateMessage}
          loadingState={false}
        />
      </div>
    );
  },
);

PlanTeams.displayName = "PlanTeams";

export default PlanTeams;