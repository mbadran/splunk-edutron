import React, { useState, useEffect, useRef } from "react";
import { Check, X, Edit } from "lucide-react";

interface NotesProps {
  notes: string;
  onUpdate?: (notes: string) => void;
  placeholder?: string;
  isEditable?: boolean;
}

const Notes: React.FC<NotesProps> = ({
  notes,
  onUpdate,
  placeholder = "Add notes...",
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(notes);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    if (!isEditable || !onUpdate) return;
    setIsEditing(true);
    setEditValue(notes);
  };

  const saveEdit = () => {
    if (onUpdate) {
      onUpdate(editValue.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(notes);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update editValue when notes prop changes
  useEffect(() => {
    setEditValue(notes);
  }, [notes]);

  if (isEditing && isEditable && onUpdate) {
    return (
      <div id="plan-notes-editor" className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className="text-lg italic text-gray-200 bg-transparent rounded px-2 py-1 border-2 border-orange-500 outline-none min-w-[400px]"
          placeholder={placeholder}
          aria-label="Edit plan notes"
        />
        <button
          onClick={saveEdit}
          className="text-green-400 hover:text-green-300 p-1"
          title="Save changes"
          aria-label="Save notes changes"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={cancelEdit}
          className="text-red-400 hover:text-red-300 p-1"
          title="Cancel editing"
          aria-label="Cancel notes editing"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const displayText = notes || placeholder;
  const hasNotes = Boolean(notes);

  return (
    <div id="plan-notes-display" className="flex items-center gap-2">
      <div
        className={`text-lg italic rounded px-2 py-1 min-w-[400px] text-left border-2 border-transparent ${
          hasNotes ? "text-gray-200" : "text-gray-400"
        } ${
          isEditable && onUpdate
            ? "hover:bg-white/10 hover:border-orange-500 cursor-pointer transition-all"
            : ""
        }`}
        onClick={isEditable && onUpdate ? startEditing : undefined}
        title={isEditable && onUpdate ? "Click to edit plan notes" : undefined}
        role={isEditable && onUpdate ? "button" : undefined}
        tabIndex={isEditable && onUpdate ? 0 : undefined}
        onKeyDown={
          isEditable && onUpdate
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  startEditing();
                }
              }
            : undefined
        }
        aria-label={
          isEditable && onUpdate ? "Plan notes - click to edit" : "Plan notes"
        }
        style={
          isEditable && onUpdate
            ? { transition: "background-color 0.2s, border-color 0.2s" }
            : {}
        }
      >
        {displayText}
      </div>
      {isEditable && onUpdate && (
        <button
          onClick={startEditing}
          className="text-gray-300 hover:text-white p-1 rounded transition-colors"
          title="Edit plan notes"
          aria-label="Edit plan notes"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Notes;
