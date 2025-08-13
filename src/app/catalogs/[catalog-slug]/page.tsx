"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import Header from "@/components/common/header/Header";
import { useCatalogs } from "@/hooks/shared/useCatalogs";
import { Catalog } from "@/types/types";

// Force static generation
export const dynamic = "force-static";

export default function CatalogDetail() {
  const router = useRouter();
  const params = useParams();
  const catalogSlug = params?.["catalog-slug"] as string;

  const { catalogs, loading, error } = useCatalogs();

  // Find the current catalog by slug
  const currentCatalog = catalogs.find(
    (catalog: Catalog) => catalog.slug === catalogSlug,
  );

  // Set page title
  useEffect(() => {
    const catalogName = currentCatalog?.name || "Catalog";
    document.title = `${catalogName} - Catalogs - ${APP_NAME}`;
  }, [currentCatalog?.name]);

  const handleBackToHome = () => {
    router.push("/");
  };

  console.log(
    "Catalog detail page: catalogSlug =",
    catalogSlug,
    "catalogs.length =",
    catalogs.length,
    "currentCatalog =",
    currentCatalog?.name,
  );

  if (loading) {
    return (
      <div
        id="catalog-detail-page"
        className="min-h-screen bg-gray-50 flex flex-col"
      >
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Loading..."
          currentRoute={`/catalogs/${catalogSlug}`}
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="loading-indicator" className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg border">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading catalog details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        id="catalog-detail-page"
        className="min-h-screen bg-gray-50 flex flex-col"
      >
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Error"
          currentRoute={`/catalogs/${catalogSlug}`}
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="error-indicator" className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg border max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Failed to load catalog
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

  // Catalog not found
  if (!currentCatalog && catalogs.length > 0) {
    return (
      <div
        id="catalog-detail-page"
        className="min-h-screen bg-gray-50 flex flex-col"
      >
        <Header
          onBackToHome={handleBackToHome}
          pageTitle="Catalog Not Found"
          currentRoute={`/catalogs/${catalogSlug}`}
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <div id="catalog-not-found" className="text-center">
            <div className="bg-white rounded-lg p-12 shadow-lg border max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Catalog Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                The catalog "{catalogSlug}" could not be found.
              </p>
              <p className="text-sm text-gray-500">
                Available catalogs: {catalogs.map((c) => c.slug).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display catalog details
  if (currentCatalog) {
    return (
      <div
        id="catalog-detail-page"
        className="min-h-screen bg-gray-50 flex flex-col"
      >
        <Header
          onBackToHome={handleBackToHome}
          pageTitle={currentCatalog.name}
          currentRoute={`/catalogs/${catalogSlug}`}
        />

        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Catalog header */}
            <div id="catalog-header" className="mb-8">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                <div className="flex items-start gap-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg flex-shrink-0">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1
                      id="catalog-name"
                      className="text-3xl font-bold text-gray-900 mb-4"
                    >
                      {currentCatalog.name}
                    </h1>

                    {currentCatalog.description && (
                      <p
                        id="catalog-description"
                        className="text-gray-600 text-lg mb-6 leading-relaxed"
                      >
                        {currentCatalog.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-gray-500">
                      <BookOpen className="w-5 h-5" />
                      <span id="catalog-course-count" className="font-medium">
                        {currentCatalog.courseCount || 0} courses available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog metadata */}
            <div id="catalog-metadata" className="mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Catalog Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      Catalog ID
                    </dt>
                    <dd
                      id="catalog-id"
                      className="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded"
                    >
                      {currentCatalog.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      Catalog Slug
                    </dt>
                    <dd
                      id="catalog-slug"
                      className="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded"
                    >
                      {currentCatalog.slug}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div id="catalog-actions" className="space-y-4">
              <Link
                href={`/catalogs/${currentCatalog.slug}/courses`}
                id="browse-courses-button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return null;
}
