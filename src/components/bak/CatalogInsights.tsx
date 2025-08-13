import React from 'react';
import { BookOpen, Users, DollarSign } from 'lucide-react';

interface Course {
  ID: string;
  Name: string;
  Category: string;
  Duration: number;
  Mode: string;
  Price: number;
  STEP_ID?: string;
}

interface CatalogInsightsProps {
  courses: Course[];
}

const CatalogInsights: React.FC<CatalogInsightsProps> = ({ courses }) => {
  // Calculate statistics
  const totalCourses = courses.length;
  const freeCoursesCount = courses.filter(course => course.Price === 0).length;
  const paidCoursesCount = totalCourses - freeCoursesCount;
  const totalDuration = courses.reduce((sum, course) => sum + course.Duration, 0);
  const averagePrice = paidCoursesCount > 0 
    ? courses.filter(course => course.Price > 0).reduce((sum, course) => sum + course.Price, 0) / paidCoursesCount
    : 0;

  // Category breakdown
  const categoryBreakdown = courses.reduce((acc, course) => {
    acc[course.Category] = (acc[course.Category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mode breakdown
  const modeBreakdown = courses.reduce((acc, course) => {
    acc[course.Mode] = (acc[course.Mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getModeLabel = (mode: string): string => {
    const labels: Record<string, string> = {
      'E': 'eLearning',
      'EL': 'eLearning + Labs',
      'ILT': 'Instructor-Led'
    };
    return labels[mode] || mode;
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Catalog Insights
      </h3>
      
      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">{totalCourses}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{freeCoursesCount}</div>
          <div className="text-sm text-gray-600">Free Courses</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{totalDuration}h</div>
          <div className="text-sm text-gray-600">Total Duration</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <div className="text-2xl font-bold text-purple-600 flex items-center">
            <DollarSign className="w-5 h-5" />
            {Math.round(averagePrice).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Avg. Price</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">By Category</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryBreakdown).map(([category, count]) => (
            <span key={category} className="bg-white px-3 py-1 rounded-full text-sm border">
              <span className="font-medium">{category}</span>
              <span className="text-gray-500 ml-1">({count})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mode Breakdown */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">By Delivery Mode</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(modeBreakdown).map(([mode, count]) => (
            <span key={mode} className="bg-white px-3 py-1 rounded-full text-sm border">
              <span className="font-medium">{getModeLabel(mode)}</span>
              <span className="text-gray-500 ml-1">({count})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogInsights;