export interface Catalog {
  id: string;
  name: string;
  description?: string;
  courseCount?: number;
  slug: string;
  csvPath?: string;
  courses?: Course[];
}

export interface CatalogConfig {
  id: string;
  name: string;
  description: string;
  slug: string;
  csvPath: string;
}

export interface Course {
  Alias: string;
  Category: string;
  Duration: number;
  ID: string;
  Language: string;
  Mode: string;
  Name: string;
  Price: number;
  STEP_ID?: string;
  [key: string]: any;
}

export interface Team {
  id: string;
  name: string;
  members: Person[];
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  role?: string;
  teamId: string; // Which team this person belongs to in this context
}

// Configuration for creating plans (templates, defaults, etc.)
export interface PlanConfig {
  defaultTitle: string;
  defaultCatalogs: string[];
  defaultTeamSize: number;
  maxTeamMembers: number;
  allowedCurrencies: string[];
  defaultCurrency: string;
  version: string;
}

// Runtime state of an active plan (what's stored in atoms)
export interface PlanState {
  id: string;
  title: string;
  notes: string;
  catalogs: string[]; // catalog IDs
  teams: string[]; // team IDs used in this plan
  teamMembers: Person[];
  selections: Record<string, Record<string, string[]>>; // personId: { catalogId: [courseIds] }
  budget: number | null;
  createdAt: string;
  updatedAt: string;
}

// Metadata for plan export/import - lean and export-specific only
export interface PlanMetadata {
  id: string; // Export ID (e.g., "export-1734892847123")
  appVersion: string; // App version at time of export
  exportedAt: string; // When this export was created
}

// Calculated metrics for plan analysis (renamed from PlanTotals)
export interface PlanMetrics {
  catalogs: number;
  costPerMember: Record<string, number>;
  courses: number;
  selections: number; // Renamed from selectedCourses to match plan.selections
  teamMembers: number;
  teams: number;
  totalCost: number;
}

// Complete plan entity for export/import (updated structure)
export interface Plan {
  metadata: PlanMetadata;
  config?: PlanConfig; // Optional embedded config for templates
  plan: PlanState;
  metrics: PlanMetrics;
  courses?: Course[]; // Optional - only include when needed for full exports
}

export interface Status {
  isWorking: boolean;
  message?: string;
}
