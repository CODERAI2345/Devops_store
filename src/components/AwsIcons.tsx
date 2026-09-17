import React from "react";

// Official AWS Logo with smile curve
export const AwsLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 80 50" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* AWS Text */}
    <path d="M18.8 28.5L14.4 14.2H10.1L5.7 28.5H9.6L10.7 24.6H14.1L15.2 28.5H18.8ZM11.6 21.4L12.5 17.5L13.4 21.4H11.6Z" fill="#FF9900" />
    <path d="M34.8 14.2H31.1L27.9 25.1L24.8 14.2H21.2L18.7 28.5H22.4L23.7 19.8L26.6 28.5H29.1L32 19.8L33.3 28.5H37L34.8 14.2Z" fill="#FF9900" />
    <path d="M47.7 23.1C47.7 21.2 46.5 19.8 43.8 19.3L41.3 18.8C40.4 18.6 40 18.2 40 17.6C40 16.9 40.7 16.5 41.8 16.5C43 16.5 44 17 44.4 18.1L47.5 16.8C46.5 14.8 44.5 13.9 41.9 13.9C38.3 13.9 36 15.6 36 18.3C36 20.4 37.4 21.7 39.8 22.2L42.5 22.8C43.5 23 44 23.5 44 24.2C44 25.1 43.1 25.6 41.9 25.6C40.3 25.6 39.1 24.8 38.6 23.3L35.4 24.8C36.3 27.2 38.7 28.3 41.8 28.3C45.6 28.3 47.7 26.3 47.7 23.1Z" fill="#FF9900" />
    {/* AWS Smile Curve Arrow */}
    <path d="M48.7 37.3C41.8 42.4 31.9 45 22 45C11.5 45 3.3 41.4 0 38.8C-0.3 38.5 0.1 38.1 0.5 38.3C8.6 43.3 18.8 46.4 29 46.4C37.8 46.4 46.9 43.5 53.4 38.4C54 37.9 54.7 38.6 54 39.2L48.7 37.3Z" fill="#FF9900" />
    <path d="M54.5 35.8C54 35.4 51.7 36.4 50.1 37C49.6 37.2 49.6 37.7 50.1 37.9C52 38.7 54.6 39.8 55.4 40.1C55.8 40.3 56.1 40 56 39.5C55.7 38.5 55 36.2 54.5 35.8Z" fill="#FF9900" />
  </svg>
);

// Route 53: Official AWS Purple Hexagon Badge with Network Routing Globe
export const Route53Icon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="r53-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8C4FFF" />
        <stop offset="100%" stopColor="#5A25BF" />
      </linearGradient>
      <linearGradient id="r53-light" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C4A8FF" />
        <stop offset="100%" stopColor="#8C4FFF" />
      </linearGradient>
    </defs>
    {/* Base Shield Hexagon */}
    <path d="M32 4L56 16V40L32 60L8 40V16L32 4Z" fill="url(#r53-grad)" />
    <path d="M32 8L52 18V38L32 54L12 38V18L32 8Z" fill="#431899" opacity="0.6" />
    
    {/* Globe Grid Lines */}
    <circle cx="32" cy="32" r="16" stroke="url(#r53-light)" strokeWidth="2" fill="none" />
    <ellipse cx="32" cy="32" rx="7" ry="16" stroke="url(#r53-light)" strokeWidth="1.5" fill="none" />
    <line x1="16" y1="32" x2="48" y2="32" stroke="url(#r53-light)" strokeWidth="1.5" />
    <line x1="20" y1="23" x2="44" y2="23" stroke="url(#r53-light)" strokeWidth="1.2" opacity="0.8" />
    <line x1="20" y1="41" x2="44" y2="41" stroke="url(#r53-light)" strokeWidth="1.2" opacity="0.8" />
    
    {/* Prominent 53 Badge */}
    <rect x="23" y="24" width="18" height="16" rx="3" fill="#1C0E42" stroke="#A882FF" strokeWidth="1.5" />
    <text x="32" y="36.5" fontSize="11" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, sans-serif">53</text>
  </svg>
);

// AWS WAF: Security Fire Shield
export const WafIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="waf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9437FF" />
        <stop offset="100%" stopColor="#4A198A" />
      </linearGradient>
      <linearGradient id="waf-flame" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FF4D4D" />
        <stop offset="50%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#FFDE59" />
      </linearGradient>
    </defs>
    {/* Shield Base */}
    <path d="M32 4L54 13V33C54 46 44 56 32 60C20 56 10 46 10 33V13L32 4Z" fill="url(#waf-grad)" />
    <path d="M32 8L50 16V33C50 43 42 52 32 55C22 52 14 43 14 33V16L32 8Z" fill="#2E0854" opacity="0.6" />

    {/* Radar / Grid Rings */}
    <circle cx="32" cy="33" r="14" stroke="#D1B3FF" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.5" />
    <line x1="32" y1="19" x2="32" y2="47" stroke="#D1B3FF" strokeWidth="1" opacity="0.4" />
    <line x1="18" y1="33" x2="46" y2="33" stroke="#D1B3FF" strokeWidth="1" opacity="0.4" />

    {/* Flame Emblem */}
    <path 
      d="M32 46 C24 46 22 40 24 34 C25 29 28 27 29 24 C30 21 31 18 32 15 C34 19 38 23 39 26 C41 30 42 33 41 37 C40 43 37 46 32 46 Z" 
      fill="url(#waf-flame)" 
    />
    <path 
      d="M32 44 C28 44 27 40 28 37 C29 34 31 32 32 29 C33 31 35 34 35 36 C36 40 34 44 32 44 Z" 
      fill="#FFFFFF" 
      opacity="0.9"
    />
  </svg>
);

// Application Load Balancer: Official AWS Purple Elastic Balancing Network Tree
export const AlbIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C925D1" />
        <stop offset="100%" stopColor="#7B1182" />
      </linearGradient>
    </defs>
    {/* Square Base */}
    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#alb-grad)" />
    <rect x="9" y="9" width="46" height="46" rx="8" fill="#3D0642" opacity="0.5" />

    {/* Ingress Client Node */}
    <circle cx="17" cy="32" r="5.5" fill="#FFFFFF" />
    <circle cx="17" cy="32" r="2.5" fill="#C925D1" />

    {/* Balancing Routing Paths */}
    <path d="M22.5 32 H30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 18 V46" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    
    <path d="M30 18 H41" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 14 L44 18 L38 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    
    <path d="M30 32 H41" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 28 L44 32 L38 36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    
    <path d="M30 46 H41" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 42 L44 46 L38 50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    {/* 3 Egress Balanced Targets */}
    <circle cx="49" cy="18" r="4.5" fill="#00E5FF" />
    <circle cx="49" cy="32" r="4.5" fill="#00E5FF" />
    <circle cx="49" cy="46" r="4.5" fill="#00E5FF" />
  </svg>
);

// Amazon EC2: Official AWS Compute Orange Processor Badge
export const Ec2Icon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ec2-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#D96600" />
      </linearGradient>
    </defs>
    {/* Outer Container */}
    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#ec2-grad)" />
    <rect x="10" y="10" width="44" height="44" rx="7" fill="#471C00" opacity="0.4" />

    {/* Chip Silicon Body */}
    <rect x="17" y="17" width="30" height="30" rx="4" fill="#FFFFFF" />
    <rect x="22" y="22" width="20" height="20" rx="2" fill="#FF9900" />
    
    {/* Inner Core Die */}
    <rect x="26" y="26" width="12" height="12" fill="#471C00" />

    {/* Top/Bottom Pins */}
    <rect x="23" y="13" width="3" height="4" fill="#FFFFFF" rx="1" />
    <rect x="30.5" y="13" width="3" height="4" fill="#FFFFFF" rx="1" />
    <rect x="38" y="13" width="3" height="4" fill="#FFFFFF" rx="1" />
    <rect x="23" y="47" width="3" height="4" fill="#FFFFFF" rx="1" />
    <rect x="30.5" y="47" width="3" height="4" fill="#FFFFFF" rx="1" />
    <rect x="38" y="47" width="3" height="4" fill="#FFFFFF" rx="1" />

    {/* Left/Right Pins */}
    <rect x="13" y="23" width="4" height="3" fill="#FFFFFF" rx="1" />
    <rect x="13" y="30.5" width="4" height="3" fill="#FFFFFF" rx="1" />
    <rect x="13" y="38" width="4" height="3" fill="#FFFFFF" rx="1" />
    <rect x="47" y="23" width="4" height="3" fill="#FFFFFF" rx="1" />
    <rect x="47" y="30.5" width="4" height="3" fill="#FFFFFF" rx="1" />
    <rect x="47" y="38" width="4" height="3" fill="#FFFFFF" rx="1" />
  </svg>
);

// Amazon RDS: Official AWS Database Blue Badge with Cylinders and Orbit
export const RdsIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rds-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B48CC" />
        <stop offset="100%" stopColor="#1E2682" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#rds-grad)" />
    <rect x="9" y="9" width="46" height="46" rx="8" fill="#0C1045" opacity="0.5" />

    {/* Orbit Back Arc */}
    <path d="M12 28 C12 21 22 17 32 17 C42 17 52 21 52 28" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />

    {/* Top Cylinder Disc */}
    <ellipse cx="32" cy="20" rx="13" ry="5" fill="#FFFFFF" />

    {/* Cylinder Body */}
    <path d="M19 20 V41 C19 45 25 48 32 48 C39 48 45 45 45 41 V20" fill="#2E39B0" stroke="#FFFFFF" strokeWidth="1.5" />

    {/* Database Rings */}
    <path d="M19 27 C19 31 25 34 32 34 C39 34 45 31 45 27" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
    <path d="M19 34 C19 38 25 41 32 41 C39 41 45 38 45 34" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />

    {/* Orbit Front Arc & Replication Satellite */}
    <path d="M8 32 C8 41 20 47 34 47 C48 47 56 41 56 32 C56 29 53 26 48 24" stroke="#00E5FF" strokeWidth="2.5" fill="none" />
    <circle cx="53" cy="36" r="3.5" fill="#00E5FF" />
  </svg>
);

// Amazon ElastiCache: Official In-Memory Cache Blue Badge
export const ElastiCacheIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cache-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2E27AD" />
        <stop offset="100%" stopColor="#140F66" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#cache-grad)" />
    <rect x="9" y="9" width="46" height="46" rx="8" fill="#080536" opacity="0.5" />

    {/* RAM DIMM Module Board */}
    <path d="M12 21 H52 V43 H38 L35 46 H29 L26 43 H12 Z" fill="#00E5FF" opacity="0.3" stroke="#00E5FF" strokeWidth="1.5" />

    {/* 4 In-Memory Microchips */}
    <rect x="15" y="26" width="6.5" height="12" rx="1" fill="#FFFFFF" />
    <rect x="25" y="26" width="6.5" height="12" rx="1" fill="#FFFFFF" />
    <rect x="33" y="26" width="6.5" height="12" rx="1" fill="#FFFFFF" />
    <rect x="42.5" y="26" width="6.5" height="12" rx="1" fill="#FFFFFF" />

    {/* Gold Pins */}
    <line x1="14" y1="41" x2="14" y2="43" stroke="#FFD700" strokeWidth="1.5" />
    <line x1="18" y1="41" x2="18" y2="43" stroke="#FFD700" strokeWidth="1.5" />
    <line x1="22" y1="41" x2="22" y2="43" stroke="#FFD700" strokeWidth="1.5" />
    <line x1="42" y1="41" x2="42" y2="43" stroke="#FFD700" strokeWidth="1.5" />
    <line x1="46" y1="41" x2="46" y2="43" stroke="#FFD700" strokeWidth="1.5" />
    <line x1="50" y1="41" x2="50" y2="43" stroke="#FFD700" strokeWidth="1.5" />
  </svg>
);

// Amazon S3: Official AWS Simple Storage Service Green Bucket Badge
export const S3Icon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="s3-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3F8624" />
        <stop offset="100%" stopColor="#1E520A" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#s3-grad)" />
    <rect x="9" y="9" width="46" height="46" rx="8" fill="#0E2E02" opacity="0.4" />

    {/* Bucket Rim Top */}
    <ellipse cx="32" cy="20" rx="15" ry="5.5" fill="#FFFFFF" />
    <ellipse cx="32" cy="20" rx="12" ry="4" fill="#3F8624" />

    {/* Bucket Body */}
    <path d="M17 20 L20 47 C20 50 25 53 32 53 C39 53 44 50 44 47 L47 20" fill="#529E2E" stroke="#FFFFFF" strokeWidth="1.5" />

    {/* Bucket Plate Discs */}
    <path d="M18 30 C21 33 26 35 32 35 C38 35 43 33 46 30" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
    <path d="M19 40 C22 43 27 45 32 45 C37 45 42 43 45 40" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />

    {/* Handle Bracket */}
    <path d="M26 14 C26 11 38 11 38 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// Brand SVGs for Domains
export const KubernetesSvg = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#326CE5" />
    <path d="M32 12L47 20.6V38L32 46.6L17 38V20.6L32 12Z" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="5" fill="#FFFFFF" />
    <line x1="32" y1="12" x2="32" y2="27" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="47" y1="20.6" x2="35.5" y2="29" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="47" y1="38" x2="35.5" y2="34" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="32" y1="46.6" x2="32" y2="37" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="17" y1="38" x2="28.5" y2="34" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="17" y1="20.6" x2="28.5" y2="29" stroke="#FFFFFF" strokeWidth="3" />
  </svg>
);

export const DockerSvg = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#1D63ED" />
    {/* Containers */}
    <rect x="20" y="22" width="6" height="5" fill="#FFFFFF" rx="1" />
    <rect x="28" y="22" width="6" height="5" fill="#FFFFFF" rx="1" />
    <rect x="36" y="22" width="6" height="5" fill="#FFFFFF" rx="1" />
    <rect x="24" y="15" width="6" height="5" fill="#FFFFFF" rx="1" />
    <rect x="32" y="15" width="6" height="5" fill="#FFFFFF" rx="1" />
    {/* Whale Body */}
    <path d="M12 33C14 28 20 28 22 28H44C49 28 53 32 54 37C51 40 44 42 36 42C23 42 16 38 12 33Z" fill="#FFFFFF" />
    <circle cx="48" cy="33" r="1.5" fill="#1D63ED" />
  </svg>
);

export const TerraformSvg = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#5C4EE5" />
    <path d="M22 17L30 22V32L22 27V17Z" fill="#FFFFFF" />
    <path d="M33 24L41 29V39L33 34V24Z" fill="#FFFFFF" opacity="0.8" />
    <path d="M22 34L30 39V49L22 44V34Z" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

export const LinuxSvg = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#FCC624" />
    {/* Penguin Body */}
    <ellipse cx="32" cy="36" rx="14" ry="16" fill="#1F2421" />
    <ellipse cx="32" cy="38" rx="9" ry="11" fill="#FFFFFF" />
    {/* Head */}
    <circle cx="32" cy="22" r="9" fill="#1F2421" />
    {/* Eyes */}
    <ellipse cx="29" cy="20" rx="2" ry="3" fill="#FFFFFF" />
    <circle cx="29.5" cy="20.5" r="1" fill="#1F2421" />
    <ellipse cx="35" cy="20" rx="2" ry="3" fill="#FFFFFF" />
    <circle cx="34.5" cy="20.5" r="1" fill="#1F2421" />
    {/* Beak */}
    <polygon points="30,24 34,24 32,27" fill="#FFA500" />
    {/* Feet */}
    <ellipse cx="26" cy="51" rx="5" ry="2.5" fill="#FFA500" />
    <ellipse cx="38" cy="51" rx="5" ry="2.5" fill="#FFA500" />
  </svg>
);

export const GithubActionsSvg = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#2088FF" />
    <path d="M22 32C22 26.5 26.5 22 32 22C36 22 39.5 24.3 41 27.8L37 29.5C36 27.5 34.2 26 32 26C28.7 26 26 28.7 26 32C26 35.3 28.7 38 32 38C34.2 38 36 36.5 37 34.5L41 36.2C39.5 39.7 36 42 32 42C26.5 42 22 37.5 22 32Z" fill="#FFFFFF" />
    <polygon points="41,25 45,32 37,32" fill="#FFFFFF" />
  </svg>
);


