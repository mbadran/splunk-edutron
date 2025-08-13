import React, { lazy, Suspense } from "react";
import { useAtom } from "jotai";
import { Home, Menu, X } from "lucide-react";
import { NAV_ROUTES } from "@/lib/routes";
import Breadcrumbs from "./Breadcrumbs";
import Title from "./Title";
import Notes from "./Notes";
import {
  planStateAtom,
  updateTitleAtom,
  updateNotesAtom,
} from "@/atoms/globalAtoms";

const DEBUG_BORDER_MODE = "debug-off" as string;

// Conditional imports for planner-specific components
const PlanActions = lazy(() => import("@/components/PlanActions"));
const PlanCalculator = lazy(() => import("@/components/PlanCalculator"));

// Conditional import for catalog-specific components
const CatalogActions = lazy(() => import("@/components/CatalogActions"));

interface HeaderProps {
  onBackToHome: () => void;
  pageTitle: string;
  onUpdateTitle?: (title: string) => void;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onBackToHome,
  pageTitle,
  onUpdateTitle,
  currentRoute = "",
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Get plan state for planner-specific features
  const [planState] = useAtom(planStateAtom);
  const [, updateTitle] = useAtom(updateTitleAtom);
  const [, updateNotes] = useAtom(updateNotesAtom);

  // Route detection
  const isPlannerRoute =
    currentRoute.includes("/planner") ||
    (typeof window !== "undefined" &&
      window.location.pathname.includes("/planner"));

  const isCatalogCoursesRoute =
    (currentRoute.includes("/catalogs/") &&
      currentRoute.includes("/courses") &&
      !currentRoute.match(/\/catalogs\/[^\/]+\/courses\/[^\/]+$/)) || // Exclude individual course pages
    (typeof window !== "undefined" &&
      window.location.pathname.includes("/catalogs/") &&
      window.location.pathname.includes("/courses") &&
      !window.location.pathname.match(/\/catalogs\/[^\/]+\/courses\/[^\/]+$/)); // Exclude individual course pages

  const showPlanActions = isPlannerRoute;
  const showCatalogActions = isCatalogCoursesRoute;
  const showCalculator = isPlannerRoute;
  const showPlanId = isPlannerRoute;
  const showPlanNotes = isPlannerRoute;

  // Handle title updates
  const handleTitleUpdate = (newTitle: string) => {
    if (isPlannerRoute) {
      updateTitle(newTitle);
    } else if (onUpdateTitle) {
      onUpdateTitle(newTitle);
    }
  };

  // Helper function to determine if a route is active
  const isRouteActive = (navRoute: string, current: string): boolean => {
    if (navRoute === current) return true;
    if (navRoute === "/" && current === "/") return true;
    if (navRoute !== "/" && current.startsWith(navRoute + "/")) return true;
    return false;
  };

  const handleNavigation = (route: string) => {
    if (route === "/") {
      onBackToHome();
    } else if (onNavigate) {
      onNavigate(route);
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      id="app-header"
      className={`${DEBUG_BORDER_MODE} shadow-lg border-b-2 border-orange-500 sticky top-0 z-20`}
      style={{
        background:
          "linear-gradient(135deg, #475569 0%, #334155 30%, #1e40af 70%, #0c1724 100%)",
      }}
    >
      <div className="px-4 sm:px-6 py-4">
        {/* Main Grid Layout: 75% left | 25% right */}
        <div className="grid grid-cols-[75%_25%] gap-4 debug-border-parent">
          {/* Left Column (75%): Navigation and Controls */}
          <div id="header-left-column" className="debug-border-child">
            {/* Sub-grid: 3 columns, 3 rows */}
            <div className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_minmax(0,auto)_auto] gap-4">
              {/* SubRow 1: Navigation Row */}
              {/* SubCol 1: Menu */}
              <div id="header-menu" className="relative debug-border-sub">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-100 transition-all shadow-lg"
                  aria-label="Navigation menu"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute top-12 left-0 bg-gradient-splunk-subtle rounded-lg shadow-xl border border-orange-500 py-2 min-w-[150px] z-30">
                    {NAV_ROUTES.map((navRoute) => (
                      <button
                        key={navRoute.route}
                        onClick={() => handleNavigation(navRoute.route)}
                        className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors font-bold text-white ${
                          isRouteActive(navRoute.route, currentRoute)
                            ? "bg-orange-500/20 border-l-4 border-orange-500"
                            : ""
                        }`}
                      >
                        {navRoute.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SubCol 2: Home Button */}
              <div id="header-home" className="debug-border-sub">
                <button
                  onClick={onBackToHome}
                  className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-medium shadow-lg"
                >
                  <Home className="w-4 h-4" />
                  <strong>Splunk EDUTRON</strong>
                </button>
              </div>

              {/* SubCol 3: Breadcrumbs + Title Combined */}
              <div
                id="header-breadcrumbs-title"
                className="flex items-center gap-2 debug-border-sub"
              >
                <Breadcrumbs
                  currentRoute={currentRoute}
                  onNavigate={onNavigate}
                />
                <Title
                  title={isPlannerRoute ? planState.title : pageTitle}
                  onUpdate={handleTitleUpdate}
                  currentRoute={currentRoute}
                />
              </div>

              {/* SubRow 2: Secondary Info */}
              {/* SubCol 1: Empty */}
              <div
                id="header-secondary-empty1"
                className="debug-border-sub"
              ></div>

              {/* SubCol 2: Plan ID (planner only) */}
              {showPlanId ? (
                <div
                  id="header-plan-id"
                  className="py-1 debug-border-sub flex items-center justify-center h-full"
                >
                  <div
                    className="text-md font-normal text-orange-400"
                    suppressHydrationWarning={true}
                  >
                    ({planState.id})
                  </div>
                </div>
              ) : (
                <div
                  id="header-plan-id-empty"
                  className="h-1 debug-border-sub"
                ></div>
              )}

              {/* SubCol 3: Notes (planner only) - wider to align edit icon with title */}
              {showPlanNotes ? (
                <div id="header-notes" className="py-1 debug-border-sub">
                  <div style={{ width: "calc(100% + 140px)" }} className="ml-7">
                    <Notes
                      notes={planState.notes || ""}
                      onUpdate={updateNotes}
                      placeholder="Notes..."
                      isEditable={true}
                    />
                  </div>
                </div>
              ) : (
                <div
                  id="header-notes-empty"
                  className="h-1 debug-border-sub"
                ></div>
              )}

              {/* SubRow 3: Actions */}
              {/* SubCol 1-2: Empty */}
              <div
                id="header-actions-empty1"
                className="debug-border-sub"
              ></div>
              <div
                id="header-actions-empty2"
                className="debug-border-sub"
              ></div>

              {/* SubCol 3: Actions (left-aligned) */}
              {showPlanActions || showCatalogActions ? (
                <div
                  id="header-actions"
                  className="py-1 debug-border-sub flex justify-start"
                >
                  {showPlanActions && (
                    <Suspense
                      fallback={
                        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
                      }
                    >
                      <PlanActions />
                    </Suspense>
                  )}
                  {showCatalogActions && (
                    <Suspense
                      fallback={
                        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
                      }
                    >
                      <CatalogActions />
                    </Suspense>
                  )}
                </div>
              ) : (
                <div
                  id="header-actions-empty"
                  className="h-1 debug-border-sub"
                ></div>
              )}
            </div>
          </div>

          {/* Right Column (25%): Calculator */}
          {showCalculator ? (
            <div
              id="header-right-column"
              className="debug-border-child flex items-start justify-end"
            >
              <Suspense
                fallback={
                  <div className="w-32 h-12 bg-gray-200 animate-pulse rounded"></div>
                }
              >
                <PlanCalculator />
              </Suspense>
            </div>
          ) : (
            <div id="header-right-empty"></div>
          )}
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Header;
