import React from "react";

export const Route53Icon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M32 58 C32 58, 54 48, 54 28 V16 L32 6 L10 16 V28 C10 48, 32 58, 32 58 Z" />
    <path d="M32 48 C32 48, 44 40, 44 26 V19 L32 12 L20 19 V26 C20 40, 32 48, 32 48 Z" />
    <text x="32" y="34" fontSize="16" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold" fontFamily="sans-serif">53</text>
  </svg>
);

export const WafIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="32" cy="32" r="24" />
    <path d="M32 4 C32 4, 32 12, 32 12" />
    <path d="M32 60 C32 60, 32 52, 32 52" />
    <path d="M4 32 C4 32, 12 32, 12 32" />
    <path d="M60 32 C60 32, 52 32, 52 32" />
    <path d="M12 12 L20 20" />
    <path d="M52 52 L44 44" />
    <path d="M12 52 L20 44" />
    <path d="M52 12 L44 20" />
    <path d="M32 44 C26 44, 22 38, 24 32 C26 26, 32 24, 32 20 C32 24, 36 26, 38 30 C40 34, 38 44, 32 44 Z" />
  </svg>
);

export const AlbIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="24" cy="32" r="14" />
    <circle cx="48" cy="16" r="6" />
    <circle cx="52" cy="32" r="6" />
    <circle cx="48" cy="48" r="6" />
    <path d="M36 26 L44 19" />
    <path d="M38 32 L46 32" />
    <path d="M36 38 L44 45" />
  </svg>
);

export const Ec2Icon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="20" y="20" width="24" height="24" />
    <path d="M12 24 L20 24 M12 32 L20 32 M12 40 L20 40" />
    <path d="M44 24 L52 24 M44 32 L52 32 M44 40 L52 40" />
    <path d="M24 12 L24 20 M32 12 L32 20 M40 12 L40 20" />
    <path d="M24 44 L24 52 M32 44 L32 52 M40 44 L40 52" />
    <rect x="8" y="8" width="48" height="48" rx="4" />
  </svg>
);

export const RdsIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="32" cy="20" rx="16" ry="6" />
    <path d="M16 20 V44 C16 47.3, 23.2, 50, 32, 50 C40.8, 50, 48, 47.3, 48, 44 V20" />
    <path d="M16 32 C16 35.3, 23.2, 38, 32, 38 C40.8, 38, 48, 35.3, 48, 32" />
    <path d="M8 12 L16 20 L8 28" />
    <path d="M56 12 L48 20 L56 28" />
    <path d="M8 36 L16 44 L8 52" />
    <path d="M56 36 L48 44 L56 52" />
  </svg>
);

export const ElastiCacheIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 20 H54 V40 H10 Z" />
    <path d="M14 20 V12 H22 V20 M30 20 V12 H38 V20 M46 20 V12 H54 V20" />
    <path d="M10 24 H6 V36 H10" />
    <path d="M54 24 H58 V36 H54" />
    <ellipse cx="32" cy="40" rx="16" ry="6" />
    <path d="M16 40 V52 C16 55.3, 23.2, 58, 32, 58 C40.8, 58, 48, 55.3, 48, 52 V40" />
    <path d="M16 46 C16 49.3, 23.2, 52, 32, 52 C40.8, 52, 48, 49.3, 48, 46" />
  </svg>
);
