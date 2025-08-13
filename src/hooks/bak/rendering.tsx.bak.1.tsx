import React, { useRef, useEffect } from "react";

interface RenderDebuggerProps {
  componentName: string;
  props?: Record<string, any>;
  state?: Record<string, any>;
  maxRenderWarning?: number;
  onMaxDepthExceeded?: (componentName: string, renderCount: number) => void;
}

interface RenderingStats {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  renderHistory: number[];
  props: Record<string, any>;
  state: Record<string, any>;
  isStopped: boolean; // NEW: Track if component is stopped
}

// Global tracking for all components
const renderingStats = new Map<string, RenderingStats>();
const RENDER_WARNING_THRESHOLD = 50;
const RENDER_ERROR_THRESHOLD = 500;
const RENDER_CRITICAL_THRESHOLD = 150; // NEW: Critical threshold for circuit breaker
const RENDER_HISTORY_SIZE = 10;

export const useRenderDebugger = (
  componentName: string,
  dependencies: Record<string, any> = {},
  options: {
    maxRenderWarning?: number;
    onMaxDepthExceeded?: (componentName: string, renderCount: number) => void;
    logLevel?: "none" | "basic" | "detailed";
  } = {},
) => {
  const renderCountRef = useRef(0);
  const lastPropsRef = useRef<Record<string, any>>({});
  const {
    maxRenderWarning = RENDER_WARNING_THRESHOLD,
    onMaxDepthExceeded,
    logLevel = "basic",
  } = options;

  // Check if component is already stopped
  const existingStats = renderingStats.get(componentName);
  if (existingStats?.isStopped) {
    return {
      renderCount: existingStats.renderCount,
      isExcessive: true,
      isCritical: true,
      isStopped: true, // NEW: Indicate component is stopped
      changedDependencies: [],
      renderFrequency: 0,
      timestamp: existingStats.lastRenderTime,
    };
  }

  // Increment render count
  renderCountRef.current++;
  const currentRenderCount = renderCountRef.current;
  const timestamp = Date.now();

  // Update global stats
  const renderHistory = existingStats?.renderHistory || [];
  renderHistory.push(timestamp);

  // Keep only recent renders
  if (renderHistory.length > RENDER_HISTORY_SIZE) {
    renderHistory.shift();
  }

  // Check if we should stop this component
  const isStopped = currentRenderCount > RENDER_CRITICAL_THRESHOLD;

  const stats: RenderingStats = {
    componentName,
    renderCount: currentRenderCount,
    lastRenderTime: timestamp,
    renderHistory,
    props: dependencies,
    state: {},
    isStopped, // NEW: Track stopped state
  };

  renderingStats.set(componentName, stats);

  // Detect prop changes
  const changedDependencies: string[] = [];
  Object.keys(dependencies).forEach((key) => {
    if (lastPropsRef.current[key] !== dependencies[key]) {
      changedDependencies.push(key);
    }
  });
  lastPropsRef.current = { ...dependencies };

  // Check for excessive renders
  const isExcessive = currentRenderCount > maxRenderWarning;
  const isCritical = currentRenderCount > RENDER_ERROR_THRESHOLD;

  // Calculate render frequency (renders per second in last window)
  const recentRenders = renderHistory.filter((time) => timestamp - time < 1000);
  const renderFrequency = recentRenders.length;

  // Log based on level and thresholds
  if (logLevel !== "none") {
    if (isStopped) {
      console.error(
        `🛑 STOPPED: ${componentName} has been stopped at ${currentRenderCount} renders to prevent browser crash!`,
        {
          renderCount: currentRenderCount,
          renderFrequency: `${renderFrequency}/sec`,
          changedDependencies,
          dependencies,
          timestamp,
          action: "Component rendering halted by circuit breaker",
        },
      );

      // Call callback if provided
      onMaxDepthExceeded?.(componentName, currentRenderCount);

      // Log stack trace to help identify the cause
      console.trace(`Stack trace for stopped component ${componentName}`);
    } else if (isCritical) {
      console.error(
        `🚨 CRITICAL: ${componentName} has rendered ${currentRenderCount} times! This may indicate infinite re-renders.`,
        {
          renderCount: currentRenderCount,
          renderFrequency: `${renderFrequency}/sec`,
          changedDependencies,
          dependencies,
          timestamp,
          warning: `Will be stopped at ${RENDER_CRITICAL_THRESHOLD} renders`,
        },
      );

      // Call callback if provided
      onMaxDepthExceeded?.(componentName, currentRenderCount);

      // Log stack trace to help identify the cause
      console.trace(`Stack trace for excessive renders in ${componentName}`);
    } else if (isExcessive) {
      console.warn(
        `⚠️ ${componentName} has rendered ${currentRenderCount} times`,
        {
          renderFrequency: `${renderFrequency}/sec`,
          changedDependencies:
            changedDependencies.length > 0
              ? changedDependencies
              : "No dependency changes detected",
          timestamp,
        },
      );
    } else if (logLevel === "detailed") {
      console.log(`🔧 ${componentName} render #${currentRenderCount}`, {
        changedDependencies:
          changedDependencies.length > 0 ? changedDependencies : "No changes",
        renderFrequency:
          renderFrequency > 1 ? `${renderFrequency}/sec` : "Normal",
        timestamp,
      });
    }
  }

  // Return debugging info
  return {
    renderCount: currentRenderCount,
    isExcessive,
    isCritical,
    isStopped, // NEW: Include stopped state
    changedDependencies,
    renderFrequency,
    timestamp,
  };
};

// NEW: Utility to manually stop a component
export const stopComponent = (componentName: string) => {
  const stats = renderingStats.get(componentName);
  if (stats) {
    renderingStats.set(componentName, { ...stats, isStopped: true });
    console.warn(`🛑 Manually stopped ${componentName} rendering`);
  }
};

// NEW: Utility to restart a stopped component
export const restartComponent = (componentName: string) => {
  const stats = renderingStats.get(componentName);
  if (stats) {
    renderingStats.set(componentName, {
      ...stats,
      isStopped: false,
      renderCount: 0, // Reset render count on restart
    });
    console.log(`🔄 Restarted ${componentName} rendering`);
  }
};

// Utility to get all rendering stats
export const getAllRenderingStats = (): RenderingStats[] => {
  return Array.from(renderingStats.values());
};

// Utility to reset stats for a component
export const resetRenderingStats = (componentName?: string) => {
  if (componentName) {
    renderingStats.delete(componentName);
  } else {
    renderingStats.clear();
  }
};

// Enhanced utility to log summary of all components
export const logRenderingSummary = () => {
  const stats = getAllRenderingStats();
  const problematicComponents = stats.filter(
    (s) => s.renderCount > RENDER_WARNING_THRESHOLD,
  );
  const stoppedComponents = stats.filter((s) => s.isStopped);

  console.group("🔧 Rendering Summary");
  console.log("Total components tracked:", stats.length);
  console.log("Problematic components:", problematicComponents.length);
  console.log("Stopped components:", stoppedComponents.length); // NEW

  if (stoppedComponents.length > 0) {
    console.error("🛑 Stopped components (circuit breaker activated):");
    stoppedComponents.forEach((stat) => {
      console.error(
        `- ${stat.componentName}: STOPPED at ${stat.renderCount} renders`,
      );
    });
  }

  if (problematicComponents.length > 0) {
    console.warn("⚠️ Components with excessive renders:");
    problematicComponents.forEach((stat) => {
      const status = stat.isStopped ? "🛑 STOPPED" : "⚠️ Running";
      console.warn(
        `- ${stat.componentName}: ${stat.renderCount} renders [${status}]`,
      );
    });
  }

  console.groupEnd();
};

// Hook for monitoring component lifecycle
export const useComponentLifecycle = (componentName: string) => {
  useEffect(() => {
    console.log(`🔧 ${componentName} mounted`);
    return () => {
      console.log(`🔧 ${componentName} unmounted`);
      // Optionally reset stats on unmount
      // resetRenderingStats(componentName);
    };
  }, [componentName]);
};

// Enhanced React component version for declarative usage
export const RenderDebugger: React.FC<RenderDebuggerProps> = ({
  componentName,
  props = {},
  state = {},
  maxRenderWarning = RENDER_WARNING_THRESHOLD,
  onMaxDepthExceeded,
}) => {
  const debugInfo = useRenderDebugger(
    componentName,
    { ...props, ...state },
    { maxRenderWarning, onMaxDepthExceeded },
  );

  // Only render in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // Enhanced display with stopped state
  const getBackgroundColor = () => {
    if (debugInfo.isStopped) return "darkred";
    if (debugInfo.isCritical) return "red";
    if (debugInfo.isExcessive) return "orange";
    return "green";
  };

  const getDisplayText = () => {
    if (debugInfo.isStopped)
      return `${componentName}: STOPPED (${debugInfo.renderCount})`;
    return `${componentName}: ${debugInfo.renderCount} renders${debugInfo.renderFrequency > 1 ? ` (${debugInfo.renderFrequency}/sec)` : ""}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9999,
        background: getBackgroundColor(),
        color: "white",
        padding: "4px 8px",
        fontSize: "12px",
        fontFamily: "monospace",
        cursor: debugInfo.isStopped ? "pointer" : "default",
      }}
      onClick={
        debugInfo.isStopped ? () => restartComponent(componentName) : undefined
      }
      title={debugInfo.isStopped ? "Click to restart component" : undefined}
    >
      {getDisplayText()}
    </div>
  );
};

export default RenderDebugger;
