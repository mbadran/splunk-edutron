import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnResizeMode,
} from "@tanstack/react-table";
import { User, Mail, UserCheck, Trash2, Plus, RefreshCw } from "lucide-react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import BaseTable, {
  createColumnsFromConfig,
  ColumnConfig,
  ColumnSizeConfig,
} from "@/components/common/BaseTable";
import TeamBase from "./TeamBase";
import { TeamMember } from "@/types/types";
import { DEFAULT_TABLE } from "@/utils/constants";

interface TeamTableProps {
  onScroll?: (scrollTop: number) => void;
}

// Jotai atoms for state management
const tableSortingAtom = atomWithStorage("team-table-sorting", []);
const newMemberNameAtom = atomWithStorage("team-new-member-name", "");

// Configuration constants - ONLY exclude fields that should never be displayed
const COLUMN_EXCEPTIONS = new Set<string>([
  // No exceptions for TeamMember fields currently
]);

// Define column order - columns not in this list will be added at the end
const COLUMN_ORDER = ["name", "email", "role", "actions"];

// Column size configuration
const COLUMN_SIZES: Record<string, ColumnSizeConfig> = {
  "#": {
    size: DEFAULT_TABLE.COLUMN_WIDTH.XSMALL,
    minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_XSMALL,
    maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_XSMALL,
  },
  name: {
    size: DEFAULT_TABLE.COLUMN_WIDTH.XLARGE,
    minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_LARGE,
    maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_XLARGE,
  },
  email: {
    size: DEFAULT_TABLE.COLUMN_WIDTH.XLARGE,
    minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_LARGE,
    maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_XLARGE,
  },
  role: {
    size: DEFAULT_TABLE.COLUMN_WIDTH.LARGE,
    minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_MEDIUM,
    maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_LARGE,
  },
  actions: {
    size: DEFAULT_TABLE.COLUMN_WIDTH.SMALL,
    minSize: DEFAULT_TABLE.COLUMN_LIMITS.MIN_SMALL,
    maxSize: DEFAULT_TABLE.COLUMN_LIMITS.MAX_SMALL,
  },
};

// Universal cell renderer function that handles all columns
const createUniversalCellRenderer = () => {
  const baseClassName = "h-12 flex items-center px-2";

  return (
    columnKey: string,
    value: unknown,
    teamMember: TeamMember,
    rowIndex: number,
    actions?: {
      updateMember: (id: string, updates: Partial<TeamMember>) => void;
      deleteMember: (id: string) => void;
    },
  ) => {
    const cellId = `team-member-${columnKey.toLowerCase()}-${rowIndex}`;

    // Handle each column type with specific styling
    switch (columnKey) {
      case "name":
        return (
          <div id={cellId}>
            <div className={`${baseClassName} justify-start`}>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) =>
                    actions?.updateMember(teamMember.id, {
                      name: e.target.value,
                    })
                  }
                  className="flex-1 bg-transparent border-none outline-none focus:bg-white focus:shadow-sm focus:px-2 focus:py-1 focus:rounded transition-all"
                  placeholder="Enter name"
                />
              </div>
            </div>
          </div>
        );

      case "email":
        return (
          <div id={cellId}>
            <div className={`${baseClassName} justify-start`}>
              <div className="flex items-center gap-2 w-full">
                <Mail className="w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={String(value || "")}
                  onChange={(e) =>
                    actions?.updateMember(teamMember.id, {
                      email: e.target.value,
                    })
                  }
                  className="flex-1 bg-transparent border-none outline-none focus:bg-white focus:shadow-sm focus:px-2 focus:py-1 focus:rounded transition-all"
                  placeholder="Enter email"
                />
              </div>
            </div>
          </div>
        );

      case "role":
        return (
          <div id={cellId}>
            <div className={`${baseClassName} justify-start`}>
              <div className="flex items-center gap-2 w-full">
                <UserCheck className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={String(value || "")}
                  onChange={(e) =>
                    actions?.updateMember(teamMember.id, {
                      role: e.target.value,
                    })
                  }
                  className="flex-1 bg-transparent border-none outline-none focus:bg-white focus:shadow-sm focus:px-2 focus:py-1 focus:rounded transition-all"
                  placeholder="Enter role"
                />
              </div>
            </div>
          </div>
        );

      case "actions":
        return (
          <div id={cellId}>
            <div className={`${baseClassName} justify-center`}>
              <button
                onClick={() => actions?.deleteMember(teamMember.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                title="Delete team member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      // Default case for any unknown columns
      default:
        return (
          <div id={cellId}>
            <div className={`${baseClassName} justify-start`}>
              <span
                className="text-sm text-gray-700 truncate w-full overflow-hidden text-ellipsis whitespace-nowrap"
                title={String(value || "")}
              >
                {String(value || "")}
              </span>
            </div>
          </div>
        );
    }
  };
};

// Column configuration for TeamMember data
const createTeamMemberColumnConfig = (
  updateMember: (id: string, updates: Partial<TeamMember>) => void,
  deleteMember: (id: string) => void,
): ColumnConfig<TeamMember> => {
  const universalCellRenderer = createUniversalCellRenderer();

  return {
    columnOrder: COLUMN_ORDER,
    columnExceptions: COLUMN_EXCEPTIONS,
    columnSizes: COLUMN_SIZES,
    // Set a default cell renderer that will be used for ALL columns
    defaultCellRenderer: (columnKey, value, teamMember, rowIndex) =>
      universalCellRenderer(columnKey, value, teamMember, rowIndex, {
        updateMember,
        deleteMember,
      }),
    customAccessors: {
      // Actions column doesn't need an accessor since it's not based on data
      actions: () => "",
    },
    customSortingFns: {
      // Actions column shouldn't be sortable
      actions: () => 0,
    },
  };
};

// Team management toolbar component
const TeamToolbar: React.FC<{
  onAddMember: (name: string) => void;
  onInitializeDefaults: () => void;
  newMemberName: string;
  onNewMemberNameChange: (name: string) => void;
  teamCount: number;
}> = ({ onAddMember, onInitializeDefaults, newMemberName, onNewMemberNameChange, teamCount }) => {
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      onNewMemberNameChange("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddMember();
    }
  };

  return (
    <div id="team-toolbar" className="flex items-center gap-4 p-4 bg-slate-50 border-b">
      <div className="flex items-center gap-2">
        <input
          id="new-member-name-input"
          type="text"
          value={newMemberName}
          onChange={(e) => onNewMemberNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter team member name"
          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
        />
        <button
          id="add-member-button"
          onClick={handleAddMember}
          disabled={!newMemberName.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          id="initialize-defaults-button"
          onClick={onInitializeDefaults}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Load Sample Data
        </button>
      </div>

      <div className="ml-auto text-sm text-gray-600">
        {teamCount} team member{teamCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

// Error display component
const TeamErrorDisplay: React.FC<{
  error: Error;
  onClearError: () => void;
}> = ({ error, onClearError }) => {
  return (
    <div id="team-error-banner" className="bg-red-50 border border-red-200 p-4 m-4 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-red-800 font-medium">Error:</span>
          <span className="text-red-700">{error.message}</span>
        </div>
        <button
          onClick={onClearError}
          className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Separate component for the table logic to ensure hooks are called consistently
const TeamTableInner: React.FC<{
  teamMembers: TeamMember[];
  error: Error | null;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;
  addMember: (name: string) => void;
  clearError: () => void;
  initializeWithDefaults: () => void;
  onScroll?: (scrollTop: number) => void;
}> = ({
  teamMembers,
  error,
  updateMember,
  deleteMember,
  addMember,
  clearError,
  initializeWithDefaults,
  onScroll,
}) => {
  const [sorting, setSorting] = useAtom(tableSortingAtom);
  const [newMemberName, setNewMemberName] = useAtom(newMemberNameAtom);

  // Create columns using BaseTable's configuration-driven approach
  const columnConfig = createTeamMemberColumnConfig(updateMember, deleteMember);
  const columns = createColumnsFromConfig(teamMembers || [], columnConfig);

  const table = useReactTable({
    data: teamMembers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    columnResizeMode: "onChange" as ColumnResizeMode,
    enableColumnResizing: true,
    enableSorting: true,
  });

  return (
    <div id="team-table" className="h-full flex flex-col">
      <TeamToolbar
        onAddMember={addMember}
        onInitializeDefaults={initializeWithDefaults}
        newMemberName={newMemberName}
        onNewMemberNameChange={setNewMemberName}
        teamCount={teamMembers.length}
      />
      
      {error && (
        <TeamErrorDisplay error={error} onClearError={clearError} />
      )}

      <div className="flex-1">
        <BaseTable
          table={table}
          onScroll={onScroll}
          headerClassName="bg-slate-800"
          rowHeight={48}
          emptyStateMessage="No team members yet. Add some members using the form above or load sample data."
          loadingState={false}
        />
      </div>
    </div>
  );
};

const TeamTable: React.FC<TeamTableProps> = ({ onScroll }) => {
  return (
    <div id="team-table-container" className="h-full">
      <TeamBase>
        {({ teamMembers, error, updateMember, deleteMember, addMember, clearError, initializeWithDefaults }) => (
          <TeamTableInner
            teamMembers={teamMembers}
            error={error}
            updateMember={updateMember}
            deleteMember={deleteMember}
            addMember={addMember}
            clearError={clearError}
            initializeWithDefaults={initializeWithDefaults}
            onScroll={onScroll}
          />
        )}
      </TeamBase>
    </div>
  );
};

export default TeamTable;