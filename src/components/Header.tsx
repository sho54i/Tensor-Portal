'use client';

import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-[#333]">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-white flex items-center justify-center">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black"></div>
        </div>
        <span className="operator-text text-xl font-bold">TENSOR</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-[#666] operator-text text-xs">
          <div className="w-2 h-2 rounded-full bg-[#50e3c2] animate-pulse"></div>
          ALL SYSTEMS OPERATIONAL
        </div>
        <DynamicWidget />
      </div>
    </header>
  );
}
