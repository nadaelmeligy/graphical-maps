export type NodeLabelType = 'none' | 'title' | 'category' | 'note' | 'equation' | 'url' | string;

export interface NodeLabelConfig {
  type: NodeLabelType;
  showBackground?: boolean;
  fontSize?: number;
}

export interface NodeData {
  id: number;
  title: string;
  field: string;
  note?: string;
  properties: Record<string, string>;
  url?: string;  // Optional URL for node linking
  equation?: string;  // LaTeX equation string
  labelConfig?: NodeLabelConfig;
  // A node can connect to multiple edges
  // This is handled implicitly through the links array in GraphData
}

export type EdgeType = 'line' | 'arrow' | 'dashed' | 'dotted' | 'bidirectional';

export interface LinkData { 
  id: string;  // Unique identifier for each link
  source: number; 
  target: number; 
  type: EdgeType;
}

export interface GraphData { 
  // nodes can have any number of connecting links
  nodes: NodeData[]; 
  // Multiple links can reference the same node as source or target
  links: LinkData[]; 
}
