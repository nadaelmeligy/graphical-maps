// src/components/Header.tsx
'use client';
import { FC } from 'react';
import Image from 'next/image';

const Header: FC = () => (
  <header className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <Image
        src="/images/logo.png"
        alt="Paper Network Pro Logo"
        width={32}
        height={32}
        className="rounded-full object-cover overflow-hidden border-2 border-gray-300 shadow-sm"
      />
      <span className="text-xl font-bold">concept network</span>
    </div>
    <nav className="space-x-4">
      <a href="#" className="text-gray-300 hover:text-white transition">Home</a>
      <a href="#" className="text-gray-300 hover:text-white transition">Docs</a>
    </nav>
  </header>
);

export default Header;
