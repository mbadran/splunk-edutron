import React, { useState, useCallback } from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="confirmation-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        id="confirmation-modal-content"
        className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
      >
        <h3 
          id="confirmation-modal-title"
          className="text-xl font-bold text-gray-800 mb-4"
        >
          {title}
        </h3>
        <p 
          id="confirmation-modal-message"
          className="text-gray-600 mb-6"
        >
          {message}
        </p>
        <div className="flex gap-4">
          <button
            id="confirmation-modal-cancel"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-bold"
          >
            Cancel
          </button>
          <button
            id="confirmation-modal-confirm"
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors font-bold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export interface UseConfirmationModalReturn {
  showConfirmation: boolean;
  showConfirmationModal: (
    action: () => void,
    title?: string,
    message?: string,
  ) => void;
  handleConfirmAction: () => void;
  handleCancelAction: () => void;
  confirmationTitle: string;
  confirmationMessage: string;
}

export const useConfirmationModal = (): UseConfirmationModalReturn => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [confirmationTitle, setConfirmationTitle] = useState("Confirm Action");
  const [confirmationMessage, setConfirmationMessage] = useState(
    "Are you sure you want to continue?",
  );

  const showConfirmationModal = useCallback(
    (
      action: () => void,
      title: string = "Confirm Action",
      message: string = "Are you sure you want to continue?",
    ) => {
      setConfirmationTitle(title);
      setConfirmationMessage(message);
      setPendingAction(() => action);
      setShowConfirmation(true);
    },
    [],
  );

  const handleConfirmAction = useCallback(() => {
    setShowConfirmation(false);
    if (pendingAction) {
      pendingAction();
    }
    setPendingAction(null);
  }, [pendingAction]);

  const handleCancelAction = useCallback(() => {
    setShowConfirmation(false);
    setPendingAction(null);
  }, []);

  return {
    showConfirmation,
    showConfirmationModal,
    handleConfirmAction,
    handleCancelAction,
    confirmationTitle,
    confirmationMessage,
  };
};