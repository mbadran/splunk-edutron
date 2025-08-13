import React, { useState, useRef } from "react";
import {
  Undo,
  Redo,
  Download,
  Upload,
  RotateCcw,
  Grid2x2Plus,
  Code,
  FileSpreadsheet,
  FileText,
  DollarSign,
  UserPlus,
  Columns3Cog,
} from "lucide-react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  setStatusAtom,
  canUndoAtom,
  canRedoAtom,
  undoAtom,
  redoAtom,
  exportPlanAtom,
  createNewPlanAtom,
  resetPlanSelectionsAtom,
  importPlanAtom,
  planStateAtom,
  plannerCoursesAtom,
  addTeamMemberAtom,
} from "@/atoms/globalAtoms";
import { useTableHistory } from "@/hooks/shared/useTableHistory";
import { ExportModal } from "./common/modals/ExportModal";
import {
  ConfirmationModal,
  useConfirmationModal,
} from "./common/modals/ConfirmationModal";
import { ErrorModal } from "./common/modals/ErrorModal";
import {
  parseImportFile,
  validateCompleteImport,
  hasNonDefaultPlanState,
  filterMissingCourses,
} from "@/utils/planner/importExport";

// MonoTable state atoms - exported for MonoTable to use
export const monoTableSortingAtom = atomWithStorage("monoTableSorting", []);
export const monoTableFiltersAtom = atomWithStorage("monoTableFilters", []);
export const monoTableColumnOrderAtom = atomWithStorage("monoTableColumnOrder", []);

const PlanActions: React.FC = () => {
  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [pendingImport, setPendingImport] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Plan state and actions
  const [, setStatus] = useAtom(setStatusAtom);
  const [canUndoPlan] = useAtom(canUndoAtom);
  const [canRedoPlan] = useAtom(canRedoAtom);
  const [, undoPlan] = useAtom(undoAtom);
  const [, redoPlan] = useAtom(redoAtom);
  const [, exportPlan] = useAtom(exportPlanAtom);
  const [, createNewPlan] = useAtom(createNewPlanAtom);
  const [, resetSelections] = useAtom(resetPlanSelectionsAtom);
  const [, importPlan] = useAtom(importPlanAtom);
  const [currentPlanState] = useAtom(planStateAtom);
  const [availableCourses] = useAtom(plannerCoursesAtom);
  const [, addTeamMember] = useAtom(addTeamMemberAtom);

  // Table state atoms
  const [tableSorting, setTableSorting] = useAtom(monoTableSortingAtom);
  const [tableFilters, setTableFilters] = useAtom(monoTableFiltersAtom);
  const [tableColumnOrder, setTableColumnOrder] = useAtom(monoTableColumnOrderAtom);

  // Table history management
  const tableHistory = useTableHistory({
    tableId: "mono",
    tableSorting,
    tableFilters,
    tableColumnOrder,
    setTableSorting,
    setTableFilters,
    setTableColumnOrder,
  });

  // Confirmation modal
  const {
    showConfirmation,
    showConfirmationModal,
    handleConfirmAction,
    handleCancelAction,
    confirmationTitle,
    confirmationMessage,
  } = useConfirmationModal();

  // LINEAR HISTORY: Plan actions take priority, table actions are secondary
  // This creates a consistent, predictable undo/redo experience
  const canUndoAny = canUndoPlan || tableHistory.canUndo;
  const canRedoAny = canRedoPlan || tableHistory.canRedo;

  const handleUndo = () => {
    console.log("Undo requested - Plan:", canUndoPlan, "Table:", tableHistory.canUndo);
    
    if (canUndoPlan) {
      console.log("Executing plan undo");
      undoPlan();
    } else if (tableHistory.canUndo) {
      console.log("Executing table undo");
      tableHistory.handleUndo();
    } else {
      console.log("No undo available");
    }
  };

  const handleRedo = () => {
    console.log("Redo requested - Plan:", canRedoPlan, "Table:", tableHistory.canRedo);
    
    if (canRedoPlan) {
      console.log("Executing plan redo");
      redoPlan();
    } else if (tableHistory.canRedo) {
      console.log("Executing table redo");
      tableHistory.handleRedo();
    } else {
      console.log("No redo available");
    }
  };

  // Plan action handlers
  const handleAddTeamMember = () => {
    const MAX_TEAM_MEMBERS = 20;

    if (currentPlanState.teamMembers.length >= MAX_TEAM_MEMBERS) {
      setStatus({
        isWorking: false,
        message: `Maximum ${MAX_TEAM_MEMBERS} members allowed`,
      });
      setTimeout(() => setStatus({ isWorking: false, message: "" }), 2000);
      return;
    }

    console.log("Adding team member");
    addTeamMember();
  };

  const handleResetSelections = () => {
    if (Object.keys(currentPlanState.selections).length === 0) {
      setStatus({ isWorking: false, message: "No selections to reset" });
      setTimeout(() => setStatus({ isWorking: false, message: "" }), 2000);
      return;
    }

    showConfirmationModal(
      () => {
        console.log("Resetting plan selections");
        resetSelections();
      },
      "Reset Course Selections",
      "Are you sure you want to clear all course selections? This action cannot be undone.",
    );
  };

  const handleNewPlan = () => {
    if (!hasNonDefaultPlanState(currentPlanState)) {
      console.log("Creating new plan - no confirmation needed");
      createNewPlan();
      return;
    }

    showConfirmationModal(
      () => {
        console.log("Creating new plan - confirmed");
        createNewPlan();
      },
      "Create New Plan",
      "Are you sure you want to create a new plan? You will lose all current selections and changes.",
    );
  };

  // Import/Export handlers
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";
    setStatus({ isWorking: true, message: "Validating import file..." });

    try {
      const fileData = await parseImportFile(file);
      const validationResult = validateCompleteImport(fileData, availableCourses);

      if (!validationResult.isValid || !validationResult.plan) {
        setErrorTitle("Import Validation Failed");
        setErrorMessage("The selected file is not a valid EDUTRON plan export.");
        setErrorDetails(validationResult.errors);
        setShowErrorModal(true);
        setStatus({ isWorking: false, message: "" });
        return;
      }

      if (validationResult.missingCourses.length > 0) {
        setErrorTitle("Missing Courses Detected");
        setErrorMessage(
          `${validationResult.missingCourses.length} course(s) from the imported plan are not available in the current catalog. You can proceed with a partial import or cancel.`,
        );
        setErrorDetails(validationResult.missingCourses);
        setPendingImport(validationResult.plan);
        setShowErrorModal(true);
        setStatus({ isWorking: false, message: "" });
        return;
      }

      if (hasNonDefaultPlanState(currentPlanState)) {
        setPendingImport(validationResult.plan);
        showConfirmationModal(
          () => executeImport(validationResult.plan),
          "Import Plan",
          `Import "${validationResult.plan.plan.title}"? This will replace your current plan and all changes will be lost.`,
        );
      } else {
        executeImport(validationResult.plan);
      }

      setStatus({ isWorking: false, message: "" });
    } catch (error) {
      setErrorTitle("Import Failed");
      setErrorMessage(error instanceof Error ? error.message : "Failed to import plan");
      setErrorDetails([]);
      setShowErrorModal(true);
      setStatus({ isWorking: false, message: "" });
    }
  };

  const executeImport = (plan: any) => {
    console.log("Executing plan import:", plan.plan.title);
    importPlan(plan.plan);
    setPendingImport(null);
  };

  const handleProceedWithPartialImport = () => {
    if (!pendingImport) return;

    setStatus({
      isWorking: true,
      message: "Importing plan with missing courses filtered...",
    });

    const missingCourses = errorDetails;
    const filteredSelections = filterMissingCourses(
      pendingImport.plan.selections,
      missingCourses,
    );

    const planWithFilteredSelections = {
      ...pendingImport.plan,
      selections: filteredSelections,
    };

    if (hasNonDefaultPlanState(currentPlanState)) {
      showConfirmationModal(
        () => executeImport({ plan: planWithFilteredSelections }),
        "Import Plan",
        `Import "${pendingImport.plan.title}" with missing courses removed? This will replace your current plan and all changes will be lost.`,
      );
    } else {
      executeImport({ plan: planWithFilteredSelections });
    }

    setShowErrorModal(false);
    setPendingImport(null);
    setStatus({ isWorking: false, message: "" });
  };

  const handleUpload = () => {
    console.log("Upload button clicked");
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    console.log("Download button clicked");
    setShowExportModal(true);
  };

  const handleExportJSON = () => {
    console.log("Exporting plan as JSON");
    setShowExportModal(false);
    exportPlan();
  };

  const handleExportCSV = () => {
    setStatus({ isWorking: false, message: "CSV export coming soon..." });
    setTimeout(() => setStatus({ isWorking: false, message: "" }), 2000);
  };

  const handleExportPDF = () => {
    setStatus({ isWorking: false, message: "PDF export coming soon..." });
    setTimeout(() => setStatus({ isWorking: false, message: "" }), 2000);
  };

  const handleExportSales = () => {
    setStatus({ isWorking: false, message: "Sales export coming soon..." });
    setTimeout(() => setStatus({ isWorking: false, message: "" }), 2000);
  };

  const renderExportOptions = () => (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={handleExportJSON}
        className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-colors font-bold shadow-lg"
        title="Export plan as JSON file (recommended)"
      >
        <Code className="w-8 h-8 mb-2" />
        <span className="text-sm">JSON</span>
        <span className="text-xs opacity-90 mt-1">(Default)</span>
      </button>

      <button
        disabled
        className="flex flex-col items-center justify-center p-6 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed font-bold"
        title="CSV Export - Coming soon!"
      >
        <FileSpreadsheet className="w-8 h-8 mb-2" />
        <span className="text-sm">CSV</span>
        <span className="text-xs opacity-75 mt-1">Coming soon</span>
      </button>

      <button
        disabled
        className="flex flex-col items-center justify-center p-6 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed font-bold"
        title="PDF Export - Coming soon!"
      >
        <FileText className="w-8 h-8 mb-2" />
        <span className="text-sm">PDF</span>
        <span className="text-xs opacity-75 mt-1">Coming soon</span>
      </button>

      <button
        disabled
        className="flex flex-col items-center justify-center p-6 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed font-bold"
        title="Sales Quote - Coming soon!"
      >
        <DollarSign className="w-8 h-8 mb-2" />
        <span className="text-sm">Sales</span>
        <span className="text-xs opacity-75 mt-1">Coming soon</span>
      </button>
    </div>
  );

  return (
    <>
      <div
        id="plan-actions"
        className="flex items-start justify-start gap-1 sm:gap-2 lg:gap-3 flex-wrap"
      >
        {/* Add Team Member */}
        <button
          onClick={handleAddTeamMember}
          disabled={currentPlanState.teamMembers.length >= 20}
          title="Add Team Member"
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Reset Plan Selections */}
        <button
          onClick={handleResetSelections}
          title="Reset Plan Selections"
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
          aria-label="Reset Plan Selections"
        >
          <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Divider */}
        <div className="w-2 sm:w-4 lg:w-6"></div>

        {/* Linear History: Undo/Redo (Plan + Table) */}
        <button
          onClick={handleUndo}
          disabled={!canUndoAny}
          title={canUndoPlan ? "Undo Plan Action" : "Undo Table Change"}
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Undo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        <button
          onClick={handleRedo}
          disabled={!canRedoAny}
          title={canRedoPlan ? "Redo Plan Action" : "Redo Table Change"}
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Redo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Divider */}
        <div className="w-2 sm:w-4 lg:w-6"></div>

        {/* Reset Table Settings */}
        <button
          onClick={tableHistory.handleReset}
          title="Reset Table Settings"
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
          aria-label="Reset Table Settings"
        >
          <Columns3Cog className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Divider */}
        <div className="w-2 sm:w-4 lg:w-6"></div>

        {/* Export/Import/New Plan */}
        <button
          onClick={handleDownload}
          title="Download Plan"
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
        >
          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        <button
          onClick={handleUpload}
          title="Upload Plan"
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
        >
          <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        <button
          onClick={handleNewPlan}
          title="Create New Plan"
          className="flex items-center justify-center p-2 sm:p-2.5 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
        >
          <Grid2x2Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
        id="plan-import-input"
      />

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Training Plan"
        description="Choose your preferred export format:"
      >
        {renderExportOptions()}
      </ExportModal>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmationTitle}
        message={confirmationMessage}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setPendingImport(null);
        }}
        title={errorTitle}
        message={errorMessage}
        details={errorDetails}
        onProceed={
          errorDetails.length > 0 ? handleProceedWithPartialImport : undefined
        }
        proceedLabel="Import Anyway"
      />
    </>
  );
};

// Event handlers for MonoTable to use with history tracking
export const useMonoTableEventHandlers = () => {
  const [tableSorting] = useAtom(monoTableSortingAtom);
  const [tableFilters] = useAtom(monoTableFiltersAtom);
  const [tableColumnOrder] = useAtom(monoTableColumnOrderAtom);
  const [, setTableSorting] = useAtom(monoTableSortingAtom);
  const [, setTableFilters] = useAtom(monoTableFiltersAtom);
  const [, setTableColumnOrder] = useAtom(monoTableColumnOrderAtom);

  const tableHistory = useTableHistory({
    tableId: "mono",
    tableSorting,
    tableFilters,
    tableColumnOrder,
    setTableSorting,
    setTableFilters,
    setTableColumnOrder,
  });

  return {
    // Current state for TanStack table
    sorting: tableSorting,
    columnFilters: tableFilters,
    columnOrder: tableColumnOrder,
    
    // Event handlers with history tracking
    onSortingChange: tableHistory.handleSortingChange,
    onColumnFiltersChange: tableHistory.handleFiltersChange,
    onColumnOrderChange: tableHistory.handleColumnOrderChange,
  };
};

export default PlanActions;