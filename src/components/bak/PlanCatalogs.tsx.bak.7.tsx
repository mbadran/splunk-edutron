import React from "react";
import { useAtom } from "jotai";
import CatalogTable from "./CatalogTable";
import { plannerCoursesAtom, planStateAtom, setStatusAtom } from "@/atoms/globalAtoms";
import { useCatalogs } from "@/utils/useCatalogs";

interface PlanCatalogsProps {
  onScroll?: (scrollTop: number) => void;
}

const PlanCatalogs: React.FC<PlanCatalogsProps> = ({ onScroll }) => {
  const { catalogs, loading, error } = useCatalogs();
  const [courses] = useAtom(plannerCoursesAtom);
  const [planState] = useAtom(planStateAtom);
  const [, setStatus] = useAtom(setStatusAtom);

  // Debug logging to track data flow
  React.useEffect(() => {
    console.log("PlanCatalogs - catalogs loaded:", catalogs.length);
    console.log("PlanCatalogs - plan catalogs:", planState.catalogs);
    console.log("PlanCatalogs - courses from atom:", courses?.length || 0);
    console.log("PlanCatalogs - sample course:", courses?.[0]?.Name || "No courses");
  }, [catalogs, planState.catalogs, courses]);

  // Update status based on loading state
  React.useEffect(() => {
    if (loading) {
      setStatus({ isWorking: true, message: "Loading plan catalogs..." });
    } else {
      setStatus({ isWorking: false, message: "" });
    }
  }, [loading, setStatus]);

  // Show loading state
  if (loading) {
    return (
      <div
        id="plan-catalogs-loading"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan catalogs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        id="plan-catalogs-error"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Plan Catalogs
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please refresh the page to try again.
          </p>
        </div>
      </div>
    );
  }

  // Show no courses state
  if (!courses || courses.length === 0) {
    return (
      <div
        id="plan-catalogs-no-data"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Courses Available
          </h3>
          <p className="text-gray-600 mb-4">
            No courses are available for the selected catalogs.
          </p>
          <p className="text-sm text-gray-500">
            Selected catalogs: {planState.catalogs.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="plan-catalogs" className="h-full">
      <CatalogTable 
        onScroll={onScroll}
        courses={courses}
      />
    </div>
  );
};

PlanCatalogs.displayName = "PlanCatalogs";

export default PlanCatalogs;