import { useState, useEffect } from 'react';
import { ForceLink } from 'd3-force';

export function useGraphLayout() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const configureD3Force = (force: any) => {
    // Configure force simulation
    force.d3Force('link').distance(50);
    force.d3Force('charge').strength(-120);
  };

  return { dimensions, configureD3Force };
}
