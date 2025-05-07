'use client';
import { FC } from 'react';

interface ResizeHandleProps {
  onMouseDown: () => void;
}

const ResizeHandle: FC<ResizeHandleProps> = ({ onMouseDown }) => (
  <div
    className="relative z-20 w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize"
    onMouseDown={onMouseDown}
  />
);

export default ResizeHandle;
