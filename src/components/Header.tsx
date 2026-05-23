'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-[#333]">
      <Link href="/" className="flex items-center gap-3 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tensor-design.svg"
          alt="Tensor"
          width={36}
          height={36}
          className="invert drop-shadow-[0_0_8px_rgba(245,158,11,0.08)] transition-transform group-hover:scale-105"
        />
        <span className="operator-text text-xl font-bold">TENSOR</span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-[#666] operator-text text-xs">
          <div className="w-2 h-2 rounded-full bg-[#50e3c2] animate-pulse"></div>
          ALL SYSTEMS OPERATIONAL
        </div>
      </div>
    </header>
  );
}
