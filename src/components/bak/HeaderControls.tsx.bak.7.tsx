import React from 'react';
import Title from './Title';
import HeaderActions from './HeaderActions';

interface HeaderControlsProps {
  planTitle: string;
  onUpdateTitle: (title: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HeaderControls = ({
  planTitle,
  onUpdateTitle,
  onUndo,
  onRedo,
  onDownload,
  canUndo,
  canRedo
}: HeaderControlsProps) => {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Title Row */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <Title title={planTitle} onUpdate={onUpdateTitle} />
      </div>

      {/* Actions Row */}
      <div className="flex-shrink-0 flex justify-center sm:justify-start">
        <HeaderActions
          onUndo={onUndo}
          onRedo={onRedo}
          onDownload={onDownload}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>
    </div>
  );
};

export default HeaderControls;