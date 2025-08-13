import { CatalogConfig } from "@/types/types";

export const APP_NAME = "Splunk EDUTRON" as const;
export const APP_VERSION = "0.1.0" as const;

// Pages where titles can be edited (by route)
export const EDITABLE_PAGE_TITLES = [
  "/catalogs/[catalog-slug]",
  "/orgs/[org-slug]",
  "/plans/[plan-slug]",
  "/teams/[team-slug]",
  "/planner",
] as const;

// Catalog configurations - centralized catalog definitions
export const CATALOG_CONFIGS: CatalogConfig[] = [
  {
    id: "splunk-step",
    name: "Splunk STEP",
    description:
      "Official Splunk Education catalog with diverse courses covering the core platform, observability, and security.",
    slug: "splunk-step",
    csvPath: "/catalogs/splunk-step.csv",
  },
  // Future catalogs can be added here
] as const;

export const DEFAULT_CATALOG = "splunk-step" as const;

export const DEFAULT_PLAN_TITLE = "Pied Piper / Splunk Training Plan" as const;

// Catalog loading constants
export const CATALOG_LOAD_ERROR_MESSAGE =
  "No catalogs could be loaded. Please check your network connection." as const;

export const COURSE_URL_TEMPLATE =
  "https://education.splunk.com/Saba/Web_spf/NA10P2PRD105/guestapp/ledetail/<STEP_ID>?utm_source=splunk-edutron" as const;

export const DETAILS_URL_TEMPLATE =
  "https://www.splunk.com/en_us/pdfs/training/<COURSE_ALIAS>-course-description.pdf" as const;

export const DEFAULT_TEAM_NAMES = [
  "Richard Hendricks",
  "Erlich Bachman",
  "Dinesh Chugtai",
  "Bertram Gilfoyle",
  "Jared Dunn",
  "Monica Hall",
  "Gavin Belson",
  "Nelson Bighetti",
  "Russ Hanneman",
  "Peter Gregory",
  "Laurie Bream",
  "Ed Chen",
  "Hoover Chan",
  "Don Bang",
  "Carla Walton",
  "Dan Melcher",
  "Fiona Wallace",
  "John Stafford",
  "Kara Swisher",
  "Maximo Reyes",
] as const;

// Table constants
// export const TABLE_FILTER_DEBOUNCE_MS = 500 as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Core: "bg-orange-500 text-white",
  "Power User": "bg-blue-500 text-white",
  Admin: "bg-green-600 text-white", // Darker green (course selections use lighter green)
  Security: "bg-red-500 text-white",
  ITSI: "bg-purple-500 text-white",
  Platform: "bg-indigo-500 text-white",
  Observability: "bg-emerald-600 text-white", // Darker emerald instead of teal
  Cloud: "bg-cyan-500 text-white",
} as const;

export const MODE_COLORS: Record<string, string> = {
  E: "bg-orange-100 text-orange-700", // Orange (Splunk brand)
  EWL: "bg-pink-100 text-pink-700", // Pink (Splunk brand gradient)
  ILT: "bg-purple-100 text-purple-700", // Purple (Splunk brand gradient)
  X: "bg-blue-100 text-blue-700", // Blue (Splunk brand gradient)
} as const;

// Language colors using Splunk brand harmony - distinct colors per language
export const LANGUAGE_COLORS: Record<string, string> = {
  English: "bg-violet-100 text-violet-700",
  Japanese: "bg-indigo-100 text-indigo-700",
  Spanish: "bg-purple-100 text-purple-700",
  Portuguese: "bg-pink-100 text-pink-700",
  French: "bg-rose-100 text-rose-700",
  German: "bg-fuchsia-100 text-fuchsia-700",
  Chinese: "bg-blue-100 text-blue-700",
  Korean: "bg-cyan-100 text-cyan-700",
  // Default fallback
  default: "bg-slate-100 text-slate-700",
} as const;

export const MODE_TOOLTIPS: Record<string, string> = {
  E: "eLearning (No Labs)",
  EWL: "eLearning (With Labs)",
  ILT: "Instructor-Led Training",
  X: "Exam", // Exam mode
} as const;

export const TABLE_DEFAULTS = {
  FILTER_DEBOUNCE_MS: 750,
  CONTAINER_HEIGHT: 400,
  VIEWPORT_HEIGHT_RATIO: 0.7,
  HEADER_OFFSET: 48,
  ROW_HEIGHT: 48,
  COLUMN_WIDTH: {
    XXXSMALL: 20, // Base
    XXSMALL: 40, // +20
    XSMALL: 60, // +20
    SMALL: 80, // +20
    MEDIUM: 120, // +40
    LARGE: 160, // +40
    XLARGE: 200, // +40
    XXLARGE: 250, // +50
    XXXLARGE: 300, // +50
    HUGE: 400, // +100
  },
  COLUMN_LIMITS: {
    MIN_XXXSMALL: 15,
    MIN_XXSMALL: 30,
    MIN_XSMALL: 40,
    MIN_SMALL: 60,
    MIN_MEDIUM: 80,
    MIN_LARGE: 100,
    MIN_XLARGE: 140,
    MIN_XXLARGE: 180,
    MIN_XXXLARGE: 220,
    MIN_HUGE: 280,
    MAX_XXXSMALL: 30,
    MAX_XXSMALL: 60,
    MAX_XSMALL: 80,
    MAX_SMALL: 100,
    MAX_MEDIUM: 150,
    MAX_LARGE: 200,
    MAX_XLARGE: 260,
    MAX_XXLARGE: 320,
    MAX_XXXLARGE: 380,
    MAX_HUGE: 600,
  },
} as const;
