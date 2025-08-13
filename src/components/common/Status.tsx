import React from "react";
import { useAtom } from "jotai";
import { workingAtom, workingMessageAtom } from "@/atoms/globalAtoms";

const Status: React.FC = () => {
  const [isWorking] = useAtom(workingAtom);
  const [workingMessage] = useAtom(workingMessageAtom);

  if (!isWorking) return null;

  return (
    <div
      id="status"
      className="fixed bottom-3 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in-0 duration-300"
    >
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center gap-3 min-w-[200px]">
        <div className="relative flex items-center justify-center">
          <div
            className="w-3 h-3 bg-white rounded-full animate-pulse"
            id="status-indicator"
          ></div>
        </div>
        <div className="text-white">
          <div
            id="status-message"
            className="text-sm font-bold"
            style={{
              // textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              fontWeight: "700",
            }}
          >
            {workingMessage || "Working..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
