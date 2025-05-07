'use client';
import { FC } from 'react';

interface SearchBoxProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ searchTerm, onSearch }) => (
  <input
    type="text"
    placeholder="Search titles..."
    value={searchTerm}
    onChange={e => onSearch(e.target.value)}
    className="w-full mb-4 p-2 border rounded"
  />
);

export default SearchBox;