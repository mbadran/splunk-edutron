// Pure utility functions for table operations

// Column reordering logic
export const reorderColumns = (
  currentOrder: string[],
  draggedColumnId: string,
  direction: 'left' | 'right'
): string[] => {
  const draggedIndex = currentOrder.indexOf(draggedColumnId);
  if (draggedIndex === -1) return currentOrder;
  
  const newOrder = [...currentOrder];
  const targetIndex = direction === 'left' ? draggedIndex - 1 : draggedIndex + 1;
  
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
  itemName: string = "items"
): string => {
  return filteredCount !== totalCount 
    ? `**${filteredCount}** ${itemName} filtered from **${totalCount}** total.`
    : `**${totalCount}** ${itemName} total.`;
};

// Specific footer message functions
export const generateCatalogFooterMessage = (
  filteredCount: number,
  totalCount: number
): string => {
  return generateTableFooterMessage(filteredCount, totalCount, "courses");
};

export const generatePlanFooterMessage = (
  filteredCount: number,
  totalCount: number,
  teamMemberCount: number
): string => {
  const courseMessage = generateTableFooterMessage(filteredCount, totalCount, "courses");
  const memberMessage = `**${teamMemberCount}** team member${teamMemberCount !== 1 ? 's' : ''}`;
  return `${courseMessage} • ${memberMessage}`;
};

// Default column orders for different table types
export const DEFAULT_CATALOG_COLUMN_ORDER = [
  "#", "ID", "Category", "Price", "Name", "PDF", "Mode", "Language", "Duration"
];

export const DEFAULT_PLAN_COLUMN_ORDER = [
  "#", "ID", "Name", "Category", "Price", "PDF", "Mode", "Language", "Duration"
  // Team member columns would be added dynamically
];

// Plan-specific helpers
export const generateTeamMemberColumnId = (memberId: string): string => {
  return `member-${memberId}`;
};

export const isTeamMemberColumn = (columnId: string): boolean => {
  return columnId.startsWith('member-');
};

export const extractMemberIdFromColumnId = (columnId: string): string => {
  return columnId.replace('member-', '');
};