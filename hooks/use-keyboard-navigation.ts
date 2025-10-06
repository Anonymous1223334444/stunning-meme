"use client";

import { useState, useEffect, useCallback } from 'react';

// Custom hook for keyboard navigation
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Detect keyboard vs mouse navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Consider user as keyboard user if Tab is pressed
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, itemCount: number) => {
    if (!isKeyboardUser) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
      case 'Enter':
      case ' ':
        // Prevent default to avoid scrolling when using spacebar
        e.preventDefault();
        // Handle selection (implemented by parent component)
        break;
    }
  }, [isKeyboardUser]);

  return {
    focusedIndex,
    setFocusedIndex,
    isKeyboardUser,
    handleKeyDown
  };
}

// Focus trap for modal components
export function useFocusTrap(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !ref.current) return;

      const focusableElements = ref.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [ref]);
}