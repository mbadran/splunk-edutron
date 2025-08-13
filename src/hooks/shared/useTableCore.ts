import React from "react";

/**
 * Core table utilities that could be shared across different table types
 * Currently minimal - can be expanded as we find truly generic patterns
 */
export const useTableCore = () => {
  // Generic scroll-to-top functionality
  const scrollToTop = React.useCallback((ref: React.RefObject<{ scrollToTop: () => void }>) => {
    if (ref.current) {
      ref.current.scrollToTop();
    }
  }, []);

  // Generic scroll handler for showing/hiding scroll-to-top button
  const useScrollButton = (threshold: number = 200) => {
    const [showScrollTop, setShowScrollTop] = React.useState(false);
    
    const handleScroll = React.useCallback((scrollTop: number) => {
      setShowScrollTop(scrollTop > threshold);
    }, [threshold]);
    
    return { showScrollTop, handleScroll };
  };

  // Generic localStorage cleaner
  const clearTableStorage = React.useCallback((keys: string[]) => {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Table storage cleared for keys:', keys);
    
    // Reload the page to reset immediately
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return {
    scrollToTop,
    useScrollButton,
    clearTableStorage,
  };
};