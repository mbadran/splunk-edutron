// Plan/MonoTable-specific table utilities
import { generateTableFooterMessage } from './coreTableHelpers';

// Default column order for plan tables
export const DEFAULT_PLAN_COLUMN_ORDER = [
  "#", "ID", "Name", "Category", "Price", "PDF", "Mode", "Language", "Duration"
  // Team member columns would be added dynamically
];

// Plan-specific helper functions
export const generateTeamMemberColumnId = (memberId: string): string => {
  return `member-${memberId}`;
};

export const isTeamMemberColumn = (columnId: string): boolean => {
  return columnId.startsWith('member-');
};

export const extractMemberIdFromColumnId = (columnId: string): string => {
  return columnId.replace('member-', '');
};

// Plan-specific footer message
export const generatePlanFooterMessage = (
  filteredCount: number,
  totalCount: number,
  teamMemberCount: number
): string => {
  const courseMessage = generateTableFooterMessage(filteredCount, totalCount, "courses");
  const memberMessage = `**${teamMemberCount}** team member${teamMemberCount !== 1 ? 's' : ''}`;
  return `${courseMessage} • ${memberMessage}`;
};