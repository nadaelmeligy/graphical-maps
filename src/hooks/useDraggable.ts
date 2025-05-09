import { useState, useCallback, MouseEvent } from 'react';

export const useDraggable = (dragHandleClass: string = 'drag-handle') => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Only start drag if clicking on the drag handle
    const target = e.target as HTMLElement;
    if (!target.classList.contains(dragHandleClass)) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position, dragHandleClass]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    position,
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp
    }
  };
};
