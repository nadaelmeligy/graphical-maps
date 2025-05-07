import { useEffect } from 'react';

/**
 * Adds mouse listeners for resizing a sidebar.
 */
export function useResize(isResizing: boolean, onWidthChange: (x: number) => void) {
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isResizing) return;
      const newW = Math.min(Math.max(e.clientX, 200), window.innerWidth - 200);
      onWidthChange(newW);
    }
    function onMouseUp() {
      // stop resizing from caller
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, onWidthChange]);
}
