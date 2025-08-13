import React from "react";

export interface TableFooterProps {
  filteredCourses: number;
  totalCourses: number;
  teamMemberCount: number;
  selectedCourses: number;
  catalogCount?: number;
  hasFilters?: boolean;
  className?: string;
}

const TableFooter: React.FC<TableFooterProps> = ({
  filteredCourses,
  totalCourses,
  teamMemberCount,
  selectedCourses,
  catalogCount = 1,
  hasFilters = false,
  className = "",
}) => {
  const parts: React.ReactNode[] = [];

  // Always show selections if any exist
  if (selectedCourses > 0) {
    const selectionText = selectedCourses === 1 ? "selection" : "selections";
    parts.push(
      <React.Fragment key="selections">
        <span id="table-footer-selections" className="font-bold text-gray-900">
          {selectedCourses}
        </span>
        <span> {selectionText}</span>
      </React.Fragment>
    );
  }

  // Team info
  if (parts.length > 0) parts.push(<span key="team-sep"> • </span>);
  parts.push(
    <React.Fragment key="teams">
      <span id="table-footer-teams" className="font-bold text-gray-900">
        1
      </span>
      <span> team</span>
    </React.Fragment>
  );

  // Team member info
  const memberText = teamMemberCount === 1 ? "team member" : "team members";
  parts.push(<span key="members-sep"> • </span>);
  parts.push(
    <React.Fragment key="members">
      <span id="table-footer-members" className="font-bold text-gray-900">
        {teamMemberCount}
      </span>
      <span> {memberText}</span>
    </React.Fragment>
  );

  // Catalog info
  const catalogText = catalogCount === 1 ? "catalog" : "catalogs";
  parts.push(<span key="catalogs-sep"> • </span>);
  parts.push(
    <React.Fragment key="catalogs">
      <span id="table-footer-catalogs" className="font-bold text-gray-900">
        {catalogCount}
      </span>
      <span> {catalogText}</span>
    </React.Fragment>
  );

  // Course info
  const courseText = totalCourses === 1 ? "course" : "courses";
  parts.push(<span key="courses-sep"> • </span>);
  parts.push(
    <React.Fragment key="courses">
      <span id="table-footer-courses" className="font-bold text-gray-900">
        {totalCourses}
      </span>
      <span> {courseText}</span>
    </React.Fragment>
  );

  // Filter info (only if filtering and different from total)
  if (hasFilters && filteredCourses !== totalCourses) {
    parts.push(<span key="filtered-sep"> • </span>);
    parts.push(
      <React.Fragment key="filtered">
        <span id="table-footer-filtered" className="font-bold text-gray-900">
          {filteredCourses}
        </span>
        <span> filtered</span>
      </React.Fragment>
    );
  }

  return (
    <div 
      id="table-footer-container" 
      className={`flex-shrink-0 px-4 py-3 bg-gray-400 border-t border-gray-100 ${className}`}
    >
      <div id="table-footer" className="text-gray-700 text-sm font-medium">
        {parts}
      </div>
    </div>
  );
};

export default TableFooter;