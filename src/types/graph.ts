export interface NodeData {
  id: number;
  title: string;
  field: string;
  note?: string;
  properties: Record<string, string>;
  // A node can connect to multiple edges
  // This is handled implicitly through the links array in GraphData
}

export interface LinkData { 
  id: string;  // Unique identifier for each link
  source: number; 
  target: number; 
}

export interface GraphData { 
  // nodes can have any number of connecting links
  nodes: NodeData[]; 
  // Multiple links can reference the same node as source or target
  links: LinkData[]; 
}
