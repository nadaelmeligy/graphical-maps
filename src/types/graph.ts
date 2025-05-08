export interface NodeData {
  id: number;
  title: string;
  field: string;
  note?: string;
  properties: Record<string, string>;
}
export interface LinkData { source: number; target: number; }
export interface GraphData { nodes: NodeData[]; links: LinkData[]; }
