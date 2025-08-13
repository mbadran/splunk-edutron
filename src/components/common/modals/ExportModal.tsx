import React from "react";

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode; // Content div with export options
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
        
        {/* Export options content */}
        <div className="mb-6">
          {children}
        </div>

        {/* Cancel button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};