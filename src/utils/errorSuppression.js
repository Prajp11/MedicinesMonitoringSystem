// Utility to suppress ResizeObserver errors
export const suppressResizeObserverErrors = () => {
  // Store the original ResizeObserver
  const OriginalResizeObserver = window.ResizeObserver;

  // Create a patched version that catches and suppresses the loop error
  window.ResizeObserver = class PatchedResizeObserver extends OriginalResizeObserver {
    constructor(callback) {
      const wrappedCallback = (entries, observer) => {
        try {
          callback(entries, observer);
        } catch (error) {
          // Suppress ResizeObserver loop errors
          if (error.message && error.message.includes('ResizeObserver loop')) {
            console.debug('ResizeObserver loop error suppressed:', error.message);
            return;
          }
          // Re-throw other errors
          throw error;
        }
      };
      super(wrappedCallback);
    }
  };

  // Also handle global error events
  const originalWindowError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    // Suppress ResizeObserver errors
    if (message && message.includes('ResizeObserver loop')) {
      console.debug('ResizeObserver error suppressed via window.onerror');
      return true;
    }
    
    // Call original error handler if it exists
    if (originalWindowError) {
      return originalWindowError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Handle unhandled promise rejections that might contain ResizeObserver errors
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('ResizeObserver loop')) {
      console.debug('ResizeObserver error suppressed via unhandledrejection');
      event.preventDefault();
      return;
    }
    
    // Call original handler if it exists
    if (originalUnhandledRejection) {
      return originalUnhandledRejection.call(this, event);
    }
  };
};

// Performance optimization for animations
export const optimizeAnimations = () => {
  // Add will-change property to elements that will be animated
  const addWillChange = () => {
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"], [class*="hover"]');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });
  };

  // Remove will-change after animations complete
  const removeWillChange = () => {
    const elements = document.querySelectorAll('[style*="will-change"]');
    elements.forEach(element => {
      element.addEventListener('animationend', () => {
        element.style.willChange = 'auto';
      });
      element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
      });
    });
  };

  // Run optimization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addWillChange();
      removeWillChange();
    });
  } else {
    addWillChange();
    removeWillChange();
  }
};

// Initialize all optimizations
export const initializeErrorSuppression = () => {
  suppressResizeObserverErrors();
  optimizeAnimations();
};