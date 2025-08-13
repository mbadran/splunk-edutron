import React from "react";
import { AlertTriangle, X } from "lucide-react";

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string[];
  onProceed?: () => void;
  proceedLabel?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  details = [],
  onProceed,
  proceedLabel = "Proceed Anyway",
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="error-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        id="error-modal-content"
        className="bg-white rounded-2xl p-8 max-w-lg mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 
            id="error-modal-title"
            className="text-xl font-bold text-gray-800"
          >
            {title}
          </h3>
          <button
            id="error-modal-close"
            onClick={onClose}
            className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <p 
          id="error-modal-message"
          className="text-gray-600 mb-4"
        >
          {message}
        </p>
        
        {details.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Missing Course IDs:
            </h4>
            <div 
              id="error-modal-details"
              className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto"
            >
              <ul className="text-sm text-gray-600 space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="font-mono">
                    • {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            id="error-modal-cancel"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-bold"
          >
            Cancel
          </button>
          {onProceed && (
            <button
              id="error-modal-proceed"
              onClick={onProceed}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors font-bold"
            >
              {proceedLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};