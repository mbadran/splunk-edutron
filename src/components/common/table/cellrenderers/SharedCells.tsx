import React from "react";
import Link from "next/link";
import { Clock, DollarSign, ExternalLink, FileText } from "lucide-react";
import { useCatalogs } from "@/hooks/shared/useCatalogs";
import {
  COURSE_URL_TEMPLATE,
  CATEGORY_COLORS,
  MODE_COLORS,
  MODE_TOOLTIPS,
  DETAILS_URL_TEMPLATE,
  LANGUAGE_COLORS,
} from "@/utils/constants";

// Shared row number cell - HYDRATION FIX: Remove unique ID
export const RowNumberCell = ({ getValue, row }: any) => (
  <div className="h-12 flex items-center justify-center px-2">
    <span className="text-sm font-mono text-gray-600 font-semibold">
      {getValue() as number}
    </span>
  </div>
);

// Shared ID cell with consistent styling
export const IDCell = ({ getValue }: any) => (
  <div className="h-12 flex items-center px-2 justify-center">
    <span
      className="text-sm text-gray-700 font-mono truncate w-full overflow-hidden text-ellipsis whitespace-nowrap"
      title={String(getValue())}
    >
      {String(getValue())}
    </span>
  </div>
);

// Shared category cell
export const CategoryCell = ({ getValue }: any) => {
  const category = String(getValue());
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
};

// Shared mode cell
export const ModeCell = ({ getValue }: any) => {
  const mode = String(getValue());
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
};

// Shared language cell
export const LanguageCell = ({ getValue }: any) => {
  const language = String(getValue()) || "EN";
  return (
    <div className="h-12 flex items-center px-2 justify-center">
      <span className="text-sm text-gray-700 font-medium">
        {language}
      </span>
    </div>
  );
};

// Shared duration cell
export const DurationCell = ({ getValue }: any) => (
  <div className="h-12 flex items-center px-2 justify-center">
    <span className="text-sm text-gray-700 font-mono">
      {getValue() as number}h
    </span>
  </div>
);

// Updated name cell - Links to internal course page instead of external LMS
export const NameCell = ({ getValue, row }: any) => {
  const { catalogs } = useCatalogs();
  const course = row.original;
  const courseName = String(getValue());
  
  // Find the catalog that contains this course to get the slug
  const catalog = catalogs.find(cat => 
    cat.courses?.some(c => c.ID === course.ID)
  );
  
  if (catalog) {
    // Generate internal course page URL
    const courseSlug = course.ID.toLowerCase();
    const courseUrl = `/catalogs/${catalog.slug}/courses/${courseSlug}`;
    
    return (
      <div className="h-12 flex items-center px-2 justify-start" style={{ minWidth: 0 }}>
        <div className="w-full min-w-0 overflow-hidden">
          <Link
            href={courseUrl}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors min-w-0 w-full overflow-hidden text-base block"
            title={courseName}
          >
            <span className="truncate min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap block">
              {courseName}
            </span>
          </Link>
        </div>
      </div>
    );
  }
  
  // Fallback if catalog not found - just display name without link
  return (
    <div className="h-12 flex items-center px-2 justify-start" style={{ minWidth: 0 }}>
      <div className="w-full min-w-0 overflow-hidden">
        <span
          className="font-medium text-gray-900 truncate block min-w-0 w-full overflow-hidden text-ellipsis whitespace-nowrap text-base"
          title={courseName}
        >
          {courseName}
        </span>
      </div>
    </div>
  );
};

// Shared PDF cell
export const PDFCell = ({ getValue, row }: any) => {
  const course = row.original;
  
  return (
    <div className="h-12 flex items-center px-2 justify-center">
      {course.Alias ? (
        <a
          href={DETAILS_URL_TEMPLATE.replace("<COURSE_ALIAS>", course.Alias)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-700 transition-colors"
          title={`View ${course.Name} details PDF`}
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
};

// Catalog price cell (for catalog tables)
export const CatalogPriceCell = ({ getValue }: any) => {
  const price = getValue() as number;
  return (
    <div className="h-12 flex items-center px-2 justify-center">
      <span className={`text-sm font-mono font-semibold ${price === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
        {price === 0 ? 'Free' : `${price.toLocaleString()}`}
      </span>
    </div>
  );
};