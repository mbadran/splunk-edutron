// Pure utility functions for table operations - generic, reusable across all table types

// Column reordering logic
export const reorderColumns = (
  currentOrder: string[],
  draggedColumnId: string,
  direction: "left" | "right",
): string[] => {
  const draggedIndex = currentOrder.indexOf(draggedColumnId);
  if (draggedIndex === -1) return currentOrder;

  const newOrder = [...currentOrder];
  const targetIndex =
    direction === "left" ? draggedIndex - 1 : draggedIndex + 1;

  // Ensure target index is within bounds
  if (targetIndex >= 0 && targetIndex < newOrder.length) {
    // Remove dragged column from current position
    const [draggedColumn] = newOrder.splice(draggedIndex, 1);
    // Insert at new position
    newOrder.splice(targetIndex, 0, draggedColumn);

    return newOrder;
  }

  return currentOrder;
};

// Generic footer message generation
export const generateTableFooterMessage = (
  filteredCount: number,
  totalCount: number,
  itemName: string = "items",
): string => {
  return filteredCount !== totalCount
    ? `**${totalCount}** courses • **${filteredCount}** filtered`
    : `**${totalCount}** ${itemName}`;
};
