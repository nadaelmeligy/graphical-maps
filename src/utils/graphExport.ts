import * as THREE from 'three';
import { saveAs } from 'file-saver';

export const createGraphPreview = (graphRef: any, includeLabels: boolean = false, graphData: any = null): string => {
  if (!graphRef?.current?.renderer) {
    throw new Error('Invalid graph reference');
  }

  try {
    // Force a render cycle and get canvas
    const renderer = graphRef.current.renderer();
    renderer.render(graphRef.current.scene(), graphRef.current.camera());
    const canvas = renderer.domElement;
    
    if (!canvas || !canvas.getContext || canvas.width === 0) {
      throw new Error('Invalid canvas state');
    }

    // Create temporary canvas with matching size
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }

    // Ensure dimensions match exactly
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the WebGL canvas using the correct size
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    // Add labels if explicitly requested
    if (includeLabels === true && graphData?.nodes) {
      try {
        // Set text properties
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        graphData.nodes.forEach((node: any) => {
          if (!node) return;

          // Get position from node data
          const pos = {
            x: node.x || 0,
            y: node.y || 0,
            z: node.z || 0
          };

          // Convert 3D position to screen coordinates
          const vector = new THREE.Vector3(pos.x, pos.y, pos.z);
          const camera = graphRef.current.camera();
          vector.project(camera);

          // Convert to pixel coordinates
          const x = ((vector.x + 1) / 2) * canvas.width;
          const y = ((-vector.y + 1) / 2) * canvas.height;

          const text = node.title || node.id.toString();
          const metrics = ctx.measureText(text);
          const padding = 8;
          const height = 24;

          // Draw background
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          // Draw rounded rectangle
          const rect = {
            x: x - metrics.width/2 - padding,
            y: y - height/2,
            width: metrics.width + padding * 2,
            height
          };

          ctx.beginPath();
          ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Draw text
          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.fillText(text, x, y);
        });
      } catch (labelError) {
        console.warn('Error adding labels:', labelError);
      }
    }
    
    return tempCanvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating graph preview:', error);
    throw new Error(`Failed to create preview: ${error.message}`);
  }
};

export const downloadGraphImage = (dataUrl: string) => {
  const link = document.createElement('a');
  link.download = 'graph-export.png';
  link.href = dataUrl;
  link.click();
};
