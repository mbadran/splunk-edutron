"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import Planner from "@/components/Planner";
import { APP_NAME } from "@/utils/constants";
import { importPlanAtom, setStatusAtom } from "@/atoms/globalAtoms";

// Force static generation
export const dynamic = "force-static";

export default function PlannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, importPlan] = useAtom(importPlanAtom);
  const [, setStatus] = useAtom(setStatusAtom);

  // Set page title
  useEffect(() => {
    document.title = `Planner - ${APP_NAME}`;
  }, []);

  const handleBackToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  // Handle upload action from URL parameters
  useEffect(() => {
    const action = searchParams.get('action');
    
    if (action === 'upload') {
      // Trigger file upload after a brief delay to ensure components are mounted
      const timer = setTimeout(() => {
        setStatus({ isWorking: true, message: "Opening file picker..." });
        
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.style.position = 'absolute';
        fileInput.style.left = '-9999px';
        
        const handleFileChange = async (event: Event) => {
          const target = event.target as HTMLInputElement;
          const file = target.files?.[0];
          
          if (file) {
            try {
              setStatus({ isWorking: true, message: "Importing plan..." });
              const text = await file.text();
              const planData = JSON.parse(text);
              importPlan(planData);
              setStatus({ isWorking: false, message: "Plan imported successfully!" });
              
              // Clear the success message after a delay
              setTimeout(() => {
                setStatus({ isWorking: false, message: "" });
              }, 2000);
            } catch (error) {
              console.error('Error importing plan:', error);
              setStatus({ isWorking: false, message: "Error importing plan. Please check the file format." });
              
              // Clear the error message after a delay
              setTimeout(() => {
                setStatus({ isWorking: false, message: "" });
              }, 3000);
            }
          } else {
            setStatus({ isWorking: false, message: "" });
          }
          
          // Clean up the file input
          if (document.body.contains(fileInput)) {
            document.body.removeChild(fileInput);
          }
        };
        
        const handleCancel = () => {
          setStatus({ isWorking: false, message: "" });
          if (document.body.contains(fileInput)) {
            document.body.removeChild(fileInput);
          }
        };
        
        fileInput.addEventListener('change', handleFileChange);
        fileInput.addEventListener('cancel', handleCancel);
        
        // Add to DOM and trigger click
        document.body.appendChild(fileInput);
        
        // Small additional delay before clicking to ensure DOM is ready
        setTimeout(() => {
          fileInput.click();
        }, 10);
        
        // Update URL to remove action parameter
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('action');
          window.history.replaceState({}, '', url.toString());
        }
      }, 500); // Increased delay
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, importPlan, setStatus]);

  return (
    <div id="planner-page">
      <Planner onBackToHome={handleBackToHome} />
    </div>
  );
}