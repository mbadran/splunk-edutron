import React from "react";
import {
  ExternalLink,
  BookOpen,
  Clock,
  Info,
  Globe,
  Tag,
  FileText,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Course as CourseType } from "@/types/types";
import {
  COURSE_URL_TEMPLATE,
  DETAILS_URL_TEMPLATE,
  CATEGORY_COLORS,
  MODE_COLORS,
  MODE_TOOLTIPS,
  LANGUAGE_COLORS,
} from "@/utils/constants";

interface CourseProps {
  course: CourseType;
  catalogName: string;
  catalogSlug: string;
}

const Course: React.FC<CourseProps> = ({
  course,
  catalogName,
  catalogSlug,
}) => {
  // Helper function to format duration
  const formatDuration = (hours: number): string => {
    if (hours === Math.floor(hours)) {
      // Whole hours
      return hours === 1 ? "1 hour" : `${hours} hours`;
    } else {
      // Has fractional part
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);

      if (wholeHours === 0) {
        return `${minutes} minutes`;
      } else {
        const hourPart = wholeHours === 1 ? "1 hour" : `${wholeHours} hours`;
        return `${hourPart} and ${minutes} minutes`;
      }
    }
  };

  // Get category color for title (extract text color from category color)
  const getCategoryTitleColor = (categoryColorClass: string) => {
    if (categoryColorClass.includes("bg-orange-500")) return "text-orange-600";
    if (categoryColorClass.includes("bg-blue-500")) return "text-blue-600";
    if (categoryColorClass.includes("bg-green-600")) return "text-green-600";
    if (categoryColorClass.includes("bg-red-500")) return "text-red-600";
    if (categoryColorClass.includes("bg-purple-500")) return "text-purple-600";
    if (categoryColorClass.includes("bg-indigo-500")) return "text-indigo-600";
    if (categoryColorClass.includes("bg-emerald-600"))
      return "text-emerald-600";
    if (categoryColorClass.includes("bg-cyan-500")) return "text-cyan-600";
    return "text-gray-900"; // fallback
  };

  // Generate external URLs
  const courseUrl = course.STEP_ID
    ? COURSE_URL_TEMPLATE.replace("<STEP_ID>", course.STEP_ID)
    : null;

  const pdfUrl = course.Alias
    ? DETAILS_URL_TEMPLATE.replace("<COURSE_ALIAS>", course.Alias.toLowerCase())
    : null;

  // Get styling for category, mode, and language
  const categoryColor =
    CATEGORY_COLORS[course.Category] || "bg-gray-500 text-white";
  const modeColor = MODE_COLORS[course.Mode] || "bg-gray-100 text-gray-700";
  const languageColor =
    LANGUAGE_COLORS[course.Language] || LANGUAGE_COLORS.default;

  // Get expanded mode description
  const modeDescription = MODE_TOOLTIPS[course.Mode] || course.Mode;

  // Get category color for title
  const titleColor = getCategoryTitleColor(categoryColor);

  return (
    <div id="course-detail" className="space-y-8">
      {/* Course Header */}
      <div
        id="course-header"
        className="bg-white rounded-lg p-8 shadow-sm border"
      >
        <div className="flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg flex-shrink-0">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span
                id="course-id"
                className="font-mono text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
              >
                {course.ID}
              </span>
            </div>

            <h1
              id="course-name"
              className={`text-3xl font-bold ${titleColor} mb-4 leading-tight`}
            >
              {course.Name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}
              >
                <Tag className="w-4 h-4 mr-1" />
                {course.Category}
              </span>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${modeColor}`}
                title={modeDescription}
              >
                {modeDescription}
              </span>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${languageColor}`}
              >
                <Globe className="w-4 h-4 mr-1" />
                {course.Language}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Grid */}
      <div id="course-details" className="grid gap-6 md:grid-cols-2">
        {/* Pricing Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Price & Duration
          </h2>
          <div className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Price</dt>
              <dd
                id="course-price"
                className={`text-2xl font-bold flex items-center gap-2 ${course.Price === 0 ? "text-emerald-600" : "text-green-600"}`}
              >
                {course.Price === 0 ? (
                  "Free"
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    {course.Price.toLocaleString()}
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Duration
              </dt>
              <dd
                id="course-duration"
                className="text-lg font-semibold text-gray-900 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                {formatDuration(course.Duration)}
              </dd>
            </div>
          </div>
        </div>

        {/* Course Attributes */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            Course Attributes
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Catalog</span>
              <Link
                href={`/catalogs/${catalogSlug}`}
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                {catalogName}
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Category
              </span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${categoryColor}`}
              >
                {course.Category}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Mode</span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${modeColor}`}
                title={modeDescription}
              >
                {modeDescription}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Language
              </span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${languageColor}`}
              >
                {course.Language}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* External Links */}
      {(courseUrl || pdfUrl) && (
        <div
          id="course-links"
          className="bg-white rounded-lg p-6 shadow-sm border"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-orange-600" />
            Course Resources
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {courseUrl && (
              <a
                href={courseUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="course-step-link"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span>View on STEP</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="course-pdf-link"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <FileText className="w-5 h-5" />
                <span>View Other Details</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div
        id="course-technical"
        className="bg-white rounded-lg p-6 shadow-sm border"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Technical Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">
              Course ID
            </dt>
            <dd
              id="course-technical-id"
              className="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded"
            >
              {course.ID}
            </dd>
          </div>

          {course.STEP_ID && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                STEP ID
              </dt>
              <dd
                id="course-technical-step-id"
                className="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded"
              >
                {course.STEP_ID}
              </dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
