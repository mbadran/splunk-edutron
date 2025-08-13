import React from "react";
import { ChevronRight } from "lucide-react";
import { useCatalogs } from "@/hooks/shared/useCatalogs";

interface BreadcrumbsProps {
  currentRoute: string;
  onNavigate?: (route: string) => void;
}

interface BreadcrumbItem {
  label: string;
  route: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const { catalogs } = useCatalogs();

  // Generate breadcrumbs based on current route
  const generateBreadcrumbs = (route: string): BreadcrumbItem[] => {
    if (route === "/") {
      return [];
    }

    // Parse route segments
    const segments = route.split("/").filter((segment) => segment !== "");

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    // Map specific routes to better labels
    const routeLabels: Record<string, string> = {
      catalogs: "Catalogs",
      planner: "Planner",
      courses: "Courses",
      settings: "Settings",
    };

    // Build breadcrumbs but exclude the last segment (current page)
    segments.slice(0, -1).forEach((segment) => {
      currentPath += `/${segment}`;

      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Check if this is a catalog slug and get actual catalog name
      if (currentPath.startsWith("/catalogs/") && !routeLabels[segment]) {
        const catalogSlug = segment;
        const catalog = catalogs.find(cat => cat.slug === catalogSlug);
        if (catalog) {
          label = catalog.name;
        }
      } else if (routeLabels[segment]) {
        label = routeLabels[segment];
      }

      breadcrumbs.push({
        label,
        route: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(currentRoute);
  const showChevron = currentRoute !== "/"; // Always show chevron except on home page

  const handleBreadcrumbClick = (route: string) => {
    if (onNavigate) {
      // Add null check and event handling
      try {
        onNavigate(route);
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback to window.location if needed
        window.location.href = route;
      }
    } else {
      // Fallback navigation if onNavigate is not provided
      window.location.href = route;
    }
  };

  if (!showChevron) {
    return null;
  }

  return (
    <nav id="breadcrumbs" className="flex items-center">
      {/* Fixed-width container for consistent chevron alignment */}
      <div className="flex items-center gap-1">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.route}>
            {/* First chevron - always positioned consistently */}
            <div className="w-4 flex justify-center">
              <ChevronRight
                className="w-4 h-4 text-white font-bold"
                style={{ strokeWidth: 3 }}
              />
            </div>
            
            {/* Breadcrumb button with consistent spacing */}
            <div className="flex-shrink-0">
              <button
                id={`breadcrumb-${crumb.route.replace(/\//g, "-")}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBreadcrumbClick(crumb.route);
                }}
                className="px-2 py-1 rounded text-sm font-bold text-orange-500 hover:text-orange-300 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                type="button"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleBreadcrumbClick(crumb.route);
                  }
                }}
              >
                {crumb.label}
              </button>
            </div>
          </React.Fragment>
        ))}
        
        {/* Final chevron before page title - always show when not on home */}
        <div className="w-4 flex justify-center ml-1">
          <ChevronRight
            className="w-4 h-4 text-white font-bold"
            style={{ strokeWidth: 3 }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;