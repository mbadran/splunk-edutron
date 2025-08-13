import React from "react";

// Catalog-specific price cell (always USD, no TU support)
export const CatalogPriceCell = ({ getValue }: any) => {
  const price = Number(getValue());
  return (
    <div className="h-12 flex items-center px-2 justify-center">
      {price === 0 ? (
        <span className="text-sm font-semibold text-green-600">
          Free
        </span>
      ) : (
        <span className="text-sm font-semibold text-gray-700">
          ${price.toLocaleString("en-US")}
        </span>
      )}
    </div>
  );
};