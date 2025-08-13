"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BookOpen, AlertTriangle, Home } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import Header from "@/components/common/header/Header";
import CourseBase from "@/components/CourseBase";
import Course from "@/components/Course";

// Force static generation
export const dynamic = "force-static";

export default function CourseDetail() {
  const router = useRouter();
  const params = useParams();
  const catalogSlug = params?.["catalog-slug"] as string;
  const courseSlug = params?.["course-slug"] as string;

  const handleBackToHome = () => {
    router.push("/");
  };

  console.log(
    "Course detail page: catalogSlug =", catalogSlug,
    "courseSlug =", courseSlug
  );

  return (
    <div id="course-detail-page" className="min-h-screen bg-gray-50 flex flex-col">
      <CourseBase catalogSlug={catalogSlug} courseSlug={courseSlug}>
        {({ course, catalog, isLoading, error, courseNotFound, catalogNotFound }) => {
          // Set page title dynamically
          useEffect(() => {
            const courseName = course?.Name || courseSlug?.toUpperCase() || "Course";
            const catalogName = catalog?.name || catalogSlug || "Catalog";
            
            // Truncate course name for page title if it's too long
            const truncatedCourseName = courseName.length > 30 
              ? courseName.substring(0, 27) + "..." 
              : courseName;
            
            document.title = `${truncatedCourseName} - ${catalogName} - Courses - ${APP_NAME}`;
          }, [course?.Name, catalog?.name]);

          // Loading state
          if (isLoading) {
            return (
              <>
                <Header
                  onBackToHome={handleBackToHome}
                  pageTitle="Loading..."
                  currentRoute={`/catalogs/${catalogSlug}/courses/${courseSlug}`}
                />

                <div className="flex-1 flex items-center justify-center p-4">
                  <div id="course-loading-indicator" className="text-center">
                    <div className="bg-white rounded-lg p-8 shadow-lg border">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading course details...</p>
                    </div>
                  </div>
                </div>
              </>
            );
          }

          // Error state
          if (error) {
            return (
              <>
                <Header
                  onBackToHome={handleBackToHome}
                  pageTitle="Error"
                  currentRoute={`/catalogs/${catalogSlug}/courses/${courseSlug}`}
                />

                <div className="flex-1 flex items-center justify-center p-4">
                  <div id="course-error-indicator" className="text-center">
                    <div className="bg-white rounded-lg p-8 shadow-lg border max-w-md mx-auto">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Failed to load course
                      </h3>
                      <p className="text-gray-600 mb-4">{error}</p>
                      <p className="text-sm text-gray-500">
                        Please refresh the page to try again.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          }

          // Catalog not found state
          if (catalogNotFound) {
            return (
              <>
                <Header
                  onBackToHome={handleBackToHome}
                  pageTitle="Catalog Not Found"
                  currentRoute={`/catalogs/${catalogSlug}/courses/${courseSlug}`}
                />

                <div className="flex-1 flex items-center justify-center p-4">
                  <div id="catalog-not-found-indicator" className="text-center">
                    <div className="bg-white rounded-lg p-12 shadow-lg border max-w-md mx-auto">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                        <BookOpen className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Catalog Not Found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        The catalog "{catalogSlug}" could not be found.
                      </p>
                      <button
                        onClick={() => router.push("/catalogs")}
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                      >
                        <Home className="w-4 h-4" />
                        Browse Catalogs
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          }

          // Course not found state
          if (courseNotFound) {
            return (
              <>
                <Header
                  onBackToHome={handleBackToHome}
                  pageTitle="Course Not Found"
                  currentRoute={`/catalogs/${catalogSlug}/courses/${courseSlug}`}
                />

                <div className="flex-1 flex items-center justify-center p-4">
                  <div id="course-not-found-indicator" className="text-center">
                    <div className="bg-white rounded-lg p-12 shadow-lg border max-w-md mx-auto">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                        <BookOpen className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Course Not Found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        The course "{courseSlug.toUpperCase()}" could not be found in the "{catalog?.name}" catalog.
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push(`/catalogs/${catalogSlug}/courses`)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                          <BookOpen className="w-4 h-4" />
                          Browse {catalog?.name} Courses
                        </button>
                        <button
                          onClick={() => router.push("/catalogs")}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                          <Home className="w-4 h-4" />
                          All Catalogs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          }

          // Success state - display course details
          if (course && catalog) {
            return (
              <>
                <Header
                  onBackToHome={handleBackToHome}
                  pageTitle={course.Name.length > 30 ? course.Name.substring(0, 27) + "..." : course.Name}
                  currentRoute={`/catalogs/${catalogSlug}/courses/${courseSlug}`}
                />

                <div className="flex-1 p-6">
                  <div className="max-w-6xl mx-auto">
                    <Course course={course} catalogName={catalog.name} catalogSlug={catalogSlug} />
                  </div>
                </div>
              </>
            );
          }

          // Fallback state (should not reach here)
          return null;
        }}
      </CourseBase>
    </div>
  );
}