'use client';
import { FC } from 'react';
import SearchBox from './SearchBox';
import FieldToggleList from './FieldToggleList';
import AddNodeForm from './AddNodeForm';
import AddEdgeForm from './AddEdgeForm';

interface SidebarProps {
  width: number;
  fields: string[];
  selectedFields: string[];
  onToggleField: (f: string) => void;
  searchTerm: string;
  onSearch: (t: string) => void;
  onAddNode: (n: any) => void;
  onAddEdge: (e: any) => void;
}

const Sidebar: FC<SidebarProps> = ({
  width,
  fields,
  selectedFields,
  onToggleField,
  searchTerm,
  onSearch,
  onAddNode,
  onAddEdge
}) => (
  <aside
    className="relative z-10 bg-white p-4 shadow-lg overflow-auto"
    style={{ width }}
  >
    <SearchBox searchTerm={searchTerm} onSearch={onSearch} />
    <FieldToggleList fields={fields} selected={selectedFields} onToggle={onToggleField} />
    <hr className="my-4" />
    <AddNodeForm onAdd={onAddNode} />
    <AddEdgeForm onAdd={onAddEdge} />
  </aside>
);

export default Sidebar;