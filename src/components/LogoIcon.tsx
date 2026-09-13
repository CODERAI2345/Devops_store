import React from 'react';
export const LogoIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Cloud background */}
    <path 
      d="M30 65C21.7157 65 15 58.2843 15 50C15 42.2783 20.8406 35.9189 28.3582 35.0833C30.6559 26.5412 38.3845 20 47.5 20C57.6534 20 66.0827 27.3592 67.8188 37.0397C75.2913 37.7719 81 44.0628 81 51.75C81 59.6191 74.6191 66 66.75 66L30 65Z" 
      fill="url(#cloud-grad)" 
      opacity="0.9"
    />
    {/* Gear */}
    <path 
      d="M60 50C60 56.6274 54.6274 62 48 62C41.3726 62 36 56.6274 36 50C36 43.3726 41.3726 38 48 38C54.6274 38 60 43.3726 60 50Z" 
      stroke="#FF8800" 
      strokeWidth="6" 
      strokeDasharray="6 4"
    />
    <circle cx="48" cy="50" r="5" fill="#00AA55" />
    {/* Code Brackets */}
    <path 
      d="M28 40L18 50L28 60M68 40L78 50L68 60" 
      stroke="#0055FF" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <defs>
      <linearGradient id="cloud-grad" x1="15" y1="20" x2="81" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" stopOpacity="0.4" />
        <stop offset="1" stopColor="#3B82F6" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  </svg>
);
