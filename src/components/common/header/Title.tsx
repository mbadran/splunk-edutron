import React, { useState, useEffect, useRef } from "react";
import { Check, X, Edit } from "lucide-react";
import { EDITABLE_PAGE_TITLES } from "@/utils/constants";

interface TitleProps {
  title: string;
  onUpdate?: (title: string) => void;
  currentRoute?: string;
}

const Title: React.FC<TitleProps> = ({ title, onUpdate, currentRoute = "" }) => {
  const isEditable = EDITABLE_PAGE_TITLES.includes(currentRoute) && onUpdate;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    if (!isEditable) return;
    setIsEditing(true);
    setEditValue(title);
  };

  const saveEdit = () => {
    if (editValue.trim() && onUpdate) {
      onUpdate(editValue.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update editValue when title prop changes
  useEffect(() => {
    setEditValue(title);
  }, [title]);

  if (isEditing && isEditable) {
    return (
      <div id="page-title-editor" className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className="text-2xl font-bold text-white bg-transparent rounded px-2 py-1 border-2 border-orange-500 outline-none min-w-[400px]"
          aria-label="Edit page title"
        />
        <button
          onClick={saveEdit}
          className="text-green-400 hover:text-green-300 p-1"
          title="Save changes"
          aria-label="Save title changes"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          onClick={cancelEdit}
          className="text-red-400 hover:text-red-300 p-1"
          title="Cancel editing"
          aria-label="Cancel title editing"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div id="page-title-display" className="flex items-center gap-2">
      <div
        className={`text-2xl font-bold text-white rounded px-2 py-1 min-w-[400px] text-left border-2 border-transparent ${
          isEditable
            ? "hover:bg-white/10 hover:border-orange-500 cursor-pointer transition-all"
            : ""
        }`}
        onClick={isEditable ? startEditing : undefined}
        title={isEditable ? "Click to edit page title" : undefined}
        role={isEditable ? "button" : undefined}
        tabIndex={isEditable ? 0 : undefined}
        onKeyDown={isEditable ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            startEditing();
          }
        } : undefined}
        aria-label={isEditable ? "Page title - click to edit" : "Page title"}
        style={
          isEditable
            ? { transition: "background-color 0.2s, border-color 0.2s" }
            : {}
        }
      >
        {title}
      </div>
      {isEditable && (
        <button
          onClick={startEditing}
          className="text-gray-300 hover:text-white p-1 rounded transition-colors"
          title="Edit page title"
          aria-label="Edit page title"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Title;