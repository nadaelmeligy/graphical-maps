import { saveAs } from 'file-saver';

export async function exportGraphImage(graphRef: { current: any; isReady: boolean }): Promise<void> {
  if (!graphRef?.current || !graphRef.isReady) {
    throw new Error('Graph is not fully initialized');
  }

  try {
    const canvas = graphRef.current.renderer().domElement;
    
    // Add a small delay to ensure the last frame is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force a render to ensure latest state
    graphRef.current.renderer().render(
      graphRef.current.scene(),
      graphRef.current.camera()
    );

    // Direct canvas to blob conversion
    const blob = await new Promise<Blob>((resolve, reject) => {
      try {
        canvas.toBlob(resolve, 'image/png');
      } catch (err) {
        reject(err);
      }
    });

    saveAs(blob, 'graph-visualization.png');
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
