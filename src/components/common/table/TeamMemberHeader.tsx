import React from "react";
import { GripVertical, ArrowUpDown, Filter, Trash2 } from "lucide-react";
import {
  ConfirmationModal,
  useConfirmationModal,
} from "../modals/ConfirmationModal";

// Enhanced team member header component with fixed styling and modal confirmation
export const TeamMemberHeader = React.memo<{
  column: any;
  member: any;
  index: number;
  totalMembers: number;
  managementHook: any;
  onMoveColumn?: (columnId: string, direction: "left" | "right") => void;
}>(({ column, member, index, totalMembers, managementHook, onMoveColumn }) => {
  const { handleDeleteTeamMember, handleUpdateTeamMember } = managementHook;

  // Modal confirmation hook
  const {
    showConfirmation,
    showConfirmationModal,
    handleConfirmAction,
    handleCancelAction,
    confirmationTitle,
    confirmationMessage,
  } = useConfirmationModal();

  // Handle team member name editing
  const handleEditName = () => {
    const newName = prompt("Enter new name:", member.name);
    if (newName && newName.trim() && newName.trim() !== member.name) {
      handleUpdateTeamMember(index, newName.trim());
    }
  };

  // Handle team member deletion with proper modal confirmation
  const handleDelete = () => {
    if (totalMembers <= 1) {
      alert("Cannot delete the last team member");
      return;
    }

    showConfirmationModal(
      () => handleDeleteTeamMember(index),
      "Remove Team Member",
      `Are you sure you want to remove ${member.name} from the plan? This will also remove all their course selections.`,
    );
  };

  // Handle binary filter toggle (selected/not selected)
  const handleFilterToggle = () => {
    const currentFilter = column.getFilterValue();
    if (currentFilter === "selected") {
      column.setFilterValue(undefined); // Turn off filter
    } else {
      column.setFilterValue("selected"); // Show only selected
    }
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    column.toggleSorting();
  };

  // Get current filter state
  const isFiltered = column.getFilterValue() === "selected";
  const sortDirection = column.getIsSorted();

  // Drag and drop handlers
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
    <>
      <div
        className="w-full h-full bg-gray-800 team-member-header"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Row 1: Team member name */}
        <div className="flex items-center justify-between w-full text-sm font-bold h-8 px-3 text-white">
          <button
            onClick={handleEditName}
            className="flex-1 text-left truncate hover:bg-white/20 rounded px-1 py-0.5 transition-colors min-w-0"
            title={`Edit ${member.name}`}
          >
            <span className="truncate block">{member.name}</span>
          </button>
        </div>

        {/* Row 2: Controls - FIXED: Reduced spacing between controls */}
        <div className="flex items-center justify-between w-full h-6 px-2">
          <div className="flex items-center gap-0.5">
            {/* Drag handle */}
            {onMoveColumn && (
              <div
                className="cursor-grab hover:cursor-grab active:cursor-grabbing p-1 rounded opacity-60 hover:opacity-100 hover:text-orange-200 hover:bg-white/10 transition-all duration-200"
                title="Drag to reorder column"
                draggable={true}
                onDragStart={handleDragStart}
              >
                <GripVertical className="w-3 h-3" />
              </div>
            )}

            {/* Sort control */}
            <button
              onClick={handleSortToggle}
              className={`p-1 rounded opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-white/10 ${
                sortDirection
                  ? "text-orange-200 opacity-100 bg-white/10"
                  : "hover:text-orange-200"
              }`}
              title={
                sortDirection === "asc"
                  ? "Sorted by selected (ascending)"
                  : sortDirection === "desc"
                    ? "Sorted by selected (descending)"
                    : "Sort by selection state"
              }
              type="button"
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>

            {/* Binary filter toggle */}
            <button
              onClick={handleFilterToggle}
              className={`p-1 rounded opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-white/10 ${
                isFiltered
                  ? "text-orange-200 opacity-100 bg-white/10"
                  : "hover:text-orange-200"
              }`}
              title={
                isFiltered
                  ? "Showing only selected courses - click to show all"
                  : "Show only courses selected for this member"
              }
              type="button"
            >
              <Filter className="w-3 h-3" />
            </button>
          </div>

          {/* Delete button - FIXED: Same color as other controls */}
          {totalMembers > 1 && (
            <button
              onClick={handleDelete}
              className="p-1 rounded opacity-60 hover:opacity-100 transition-all duration-200 hover:bg-white/10 hover:text-orange-200"
              title={`Remove ${member.name} from the plan`}
              aria-label={`Remove ${member.name} from the plan`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Modal confirmation for deletion */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmationTitle}
        message={confirmationMessage}
      />
    </>
  );
});

TeamMemberHeader.displayName = "TeamMemberHeader";
