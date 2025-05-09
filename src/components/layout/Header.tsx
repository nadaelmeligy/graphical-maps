// src/components/Header.tsx
'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import AboutModal from '../modals/AboutModal';
import SettingsModal from '../modals/SettingsModal';
import DocumentationModal from '../docs/DocumentationModal';

interface HeaderProps {
  onToggleTopBar: () => void;
  isTopBarVisible: boolean;
  settings: {
    showLinkCount: boolean;
    showCategory: boolean;
    layout: 'force' | 'radial' | 'hierarchical' | 'circular';
    topology: 'free' | 'star' | 'ring' | 'grid' | 'tree';
  };
  onSettingsChange: (settings: typeof HeaderProps['settings']) => void;
}

const Header: FC<HeaderProps> = ({ onToggleTopBar, isTopBarVisible, settings, onSettingsChange }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Paper Network Pro Logo"
          width={32}
          height={32}
          className="rounded-full object-cover overflow-hidden border-2 border-gray-300 shadow-sm"
        />
        <span className="text-xl font-bold">Concept Map</span>
      </div>

      <nav className="space-x-4">
        <button 
          onClick={onToggleTopBar}
          className="text-gray-300 hover:text-white transition"
        >
          {isTopBarVisible ? 'Hide Tools' : 'Show Tools'}
        </button>
        <a href="#" className="text-gray-300 hover:text-white transition">Home</a>
        <button
          onClick={() => setShowDocs(true)}
          className="text-gray-300 hover:text-white transition"
        >
          Docs
        </button>
        <button
          onClick={() => setShowAbout(true)}
          className="text-gray-300 hover:text-white transition"
        >
          About
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className="text-gray-300 hover:text-white transition"
        >
          Settings
        </button>
      </nav>
      {showDocs && <DocumentationModal onClose={() => setShowDocs(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      )}
    </header>
  );
};

export default Header;
