"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, ExternalLink } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import Header from "@/components/common/header/Header";
import { useCatalogs } from "@/hooks/shared/useCatalogs";
import { Catalog } from "@/types/types";

// Force static generation
export const dynamic = "force-static";

export default function Catalogs() {
  const router = useRouter();
  const { catalogs, loading, error } = useCatalogs();

  // Set page title
  useEffect(() => {
    document.title = `Catalogs - ${APP_NAME}`;
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  console.log(
    "Catalogs page: catalogs.length =",
    catalogs.length,
    "loading =",
    loading,
    "error =",
    error,
  );

  if (loading) {
    return (
      <div id="catalogs-page" className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Catalogs"
          currentRoute="/catalogs"
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="loading-indicator" className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg border">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading catalogs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="catalogs-page" className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Catalogs"
          currentRoute="/catalogs"
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="error-indicator" className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg border max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Failed to load catalogs
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Please refresh the page to try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="catalogs-page" className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onBackToHome={handleBackToHome}
        pageTitle="Catalogs"
        currentRoute="/catalogs"
      />

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div id="catalogs-summary" className="mb-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Browse Training Catalogs
              </h2>
              <p className="text-gray-600 mb-4">
                Explore available training catalogs and courses.
              </p>
              <div className="text-sm text-gray-500">
                <span id="catalogs-count">
                  {catalogs.length} catalogs available
                </span>
              </div>
            </div>
          </div>

          <div
            id="catalogs-grid"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {catalogs.map((catalog: Catalog) => (
              <div
                key={catalog.id}
                id={`catalog-card-${catalog.id}`}
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {catalog.name}
                  </h3>

                  {catalog.description && (
                    <p className="text-gray-600 mb-4 line-clamp-4">
                      {catalog.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <BookOpen className="w-4 h-4" />
                    <span id={`course-count-${catalog.id}`}>
                      {catalog.courseCount || 0} courses available
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/catalogs/${catalog.slug}`}
                    id={`view-catalog-${catalog.id}`}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Details
                  </Link>
                  <Link
                    href={`/catalogs/${catalog.slug}/courses`}
                    id={`view-courses-${catalog.id}`}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Browse Courses
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {catalogs.length === 0 && !loading && !error && (
            <div id="no-catalogs" className="text-center py-12">
              <div className="bg-white rounded-lg p-12 shadow-sm border max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No catalogs available
                </h3>
                <p className="text-gray-600">
                  Check back later for training catalogs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
