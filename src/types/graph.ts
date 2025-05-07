export interface NodeData { id: number; title: string; field: string; }
export interface LinkData { source: number; target: number; }
export interface GraphData { nodes: NodeData[]; links: LinkData[]; }
