import React from "react";
import { Course, Person } from "@/types/types";

interface PlanSelectionCellProps {
  course: Course;
  member: Person;
  isSelected: boolean;
  onToggle: (course: Course, member: Person) => void;
}

export const PlanSelectionCell = React.memo<PlanSelectionCellProps>(
  ({ course, member, isSelected, onToggle }) => {
    return (
      <div className="h-12 flex items-center justify-center px-2">
        {isSelected ? (
          <button
            onClick={() => onToggle(course, member)}
            className="w-full h-8 flex items-center justify-center text-lg font-bold transition-all duration-200 rounded cursor-pointer bg-emerald-300 text-white hover:bg-emerald-400"
            title={`Remove ${member.name} from '${course.Name}'`}
            aria-label={`Remove course ${course.Name} from ${member.name}'s training plan`}
          >
            ●
          </button>
        ) : (
          <button
            onClick={() => onToggle(course, member)}
            className="w-full h-8 flex items-center justify-center transition-all duration-200 rounded cursor-pointer hover:bg-orange-100"
            title={`Add ${member.name} to '${course.Name}'`}
            aria-label={`Add course ${course.Name} to ${member.name}'s training plan`}
          >
            <span className="text-gray-300 text-lg">○</span>
          </button>
        )}
      </div>
    );
  },
);

PlanSelectionCell.displayName = "PlanSelectionCell";
