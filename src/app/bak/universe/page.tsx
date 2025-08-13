"use client";

// import { Metadata } from "next";

// Force static generation
export const dynamic = "force-static";

// This would be for Server Components, but since we're using 'use client',
// we'll handle metadata in the component
// export const metadata: Metadata = {
//   title: 'Universe - Splunk EDUTRON',
//   description: 'Test universe page for Splunk EDUTRON'
// }

export default function Universe() {
  return (
    <div id="universe-page" className="min-h-screen p-8">
      <div id="universe-container" className="max-w-4xl mx-auto">
        <h1 id="universe-heading" className="text-4xl font-bold mb-4">
          Hello, world!
        </h1>
        <p id="universe-description" className="text-lg text-gray-600">
          This is the test universe page running on App Router with SSG.
        </p>
        <div id="universe-info" className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Page Info:</h2>
          <ul className="space-y-1">
            <li>• Route: /universe</li>
            <li>• Rendered: Client-side</li>
            <li>• Generation: Static (SSG)</li>
            <li>• Router: App Router</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
