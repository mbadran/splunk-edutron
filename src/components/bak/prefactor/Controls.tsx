import React, { useState } from 'react';
import { Home, Users, BookOpen, Check, Save, Undo, Redo, Edit, X } from 'lucide-react';

// Editable Title Component
const EditableTitle = ({ title, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const startEditing = () => {
    setIsEditing(true);
    setEditValue(title);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      onUpdate(editValue.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          className="text-2xl font-bold text-gray-900 bg-blue-200 rounded px-2 py-1 border-2 border-blue-400 outline-none min-w-[400px]"
          autoFocus
        />
        <button onClick={saveEdit} className="text-green-600 hover:text-green-700">
          <Check className="w-5 h-5" />
        </button>
        <button onClick={cancelEdit} className="text-red-600 hover:text-red-700">
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={startEditing}
        className="text-2xl font-bold text-white hover:bg-white/20 rounded px-2 py-1 transition-all min-w-[400px] text-left"
        title="Click to edit title"
      >
        {title}
      </button>
      <button onClick={startEditing} className="text-gray-300 hover:text-white">
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );
};

const Controls = ({
  onBackToWelcome,
  planTitle,
  onUpdateTitle,
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  teamCount,
  courseCount,
  selectedCount
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 shadow-lg border-b-2 border-orange-500 sticky top-0 z-20">
      <div className="px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBackToWelcome}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-medium shadow-lg"
        >
          <Home className="w-4 h-4" /><strong>Splunk EDUTRON</strong>
        </button>
        
        <div className="flex-1 min-w-0">
          <EditableTitle title={planTitle} onUpdate={onUpdateTitle} />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Undo className="w-4 h-4" />
            Undo
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Redo className="w-4 h-4" />
            Redo
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium shadow-lg"
          >
            <Save className="w-4 h-4" />
            Download
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-white">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{teamCount} member(s)</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{courseCount} courses</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>{selectedCount} selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
