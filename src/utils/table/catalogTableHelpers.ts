// Catalog-specific table utilities
import { generateTableFooterMessage } from './coreTableHelpers';

// Default column order for catalog tables
export const DEFAULT_CATALOG_COLUMN_ORDER = [
  "#", "ID", "Category", "Price", "Name", "PDF", "Mode", "Language", "Duration"
];

// Catalog-specific footer message
export const generateCatalogFooterMessage = (
  filteredCount: number,
  totalCount: number
): string => {
  return generateTableFooterMessage(filteredCount, totalCount, "courses");
};