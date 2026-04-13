'use client';
import Image from 'next/image';

export default function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/E1E71XMQE1"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#FF5E5B]/15 hover:bg-[#FF5E5B]/30 border border-[#FF5E5B]/30 hover:border-[#FF5E5B]/60 transition-all duration-200 group"
      title="Buy Me a Coffee"
    >
      {/* Ko-fi cup icon inline SVG — no external image needed */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M18 8h1a4 4 0 0 1 0 8h-1"
          stroke="#FF5E5B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
          stroke="#FF5E5B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 1v3M10 1v3M14 1v3"
          stroke="#FF5E5B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs font-medium text-[#FF5E5B] hidden sm:inline group-hover:text-[#ff7875]">
        Buy me a coffee
      </span>
    </a>
  );
}
