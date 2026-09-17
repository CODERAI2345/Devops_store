import React from 'react';
import { motion } from 'motion/react';
import { Route53Icon, WafIcon, AlbIcon, Ec2Icon, RdsIcon, ElastiCacheIcon, S3Icon, AwsLogo } from "./AwsIcons";
import { Users, Shield, Cpu, Database, Cloud } from 'lucide-react';

export function PipelineAnimation() {
  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#06080a] text-slate-300 font-sans shadow-2xl overflow-hidden flex flex-col my-8">
      {/* Topology Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-white/10 bg-white/[0.02] backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <AwsLogo className="w-7 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-wide">Production AWS Topology</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">us-east-1</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Live Traffic
          </span>
          <span className="text-slate-200 text-[11px] sm:hidden">
            Scroll horizontally to view all →
          </span>
        </div>
      </div>

      {/* Diagram Scroll Container */}
      <div className="relative w-full overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#05070a]">
        <div className="relative w-[1220px] h-[640px] select-none">
          {/* Topographic Background */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '36px 36px'
          }} />

          {/* VPC Boundary */}
          <div className="absolute left-[420px] top-[110px] w-[730px] h-[390px] border-2 border-dashed border-orange-500/40 rounded-2xl bg-orange-500/[0.02] z-0 flex flex-col shadow-[inset_0_0_40px_rgba(249,115,22,0.03)]">
            <div className="absolute -top-3.5 left-6 bg-[#090d15] px-3 py-0.5 text-xs font-mono text-orange-400 font-semibold border border-orange-500/30 rounded-full flex items-center gap-2 shadow-md">
              <Cloud className="w-3.5 h-3.5" /> aws-vpc-production (10.0.0.0/16)
            </div>
          </div>

          {/* Public Subnet */}
          <div className="absolute left-[440px] top-[155px] w-[180px] h-[325px] border border-cyan-500/30 rounded-xl bg-cyan-500/[0.03] z-0 flex flex-col">
            <div className="absolute -top-3 left-4 bg-[#090d15] px-2.5 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-500/30 rounded-md">
              Public Subnet (ALB)
            </div>
          </div>

          {/* Private Subnet (Compute) */}
          <div className="absolute left-[645px] top-[155px] w-[215px] h-[325px] border border-purple-500/30 rounded-xl bg-purple-500/[0.03] z-0 flex flex-col">
            <div className="absolute -top-3 left-4 bg-[#090d15] px-2.5 py-0.5 text-[10px] font-mono text-purple-400 border border-purple-500/30 rounded-md flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Private Compute Subnet
            </div>
          </div>

          {/* Private Subnet (Data) */}
          <div className="absolute left-[885px] top-[155px] w-[240px] h-[265px] border border-emerald-500/30 rounded-xl bg-emerald-500/[0.03] z-0 flex flex-col">
            <div className="absolute -top-3 left-4 bg-[#090d15] px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 rounded-md flex items-center gap-1.5">
              <Database className="w-3 h-3" /> Data Tier (Multi-AZ)
            </div>
          </div>

          {/* SVG Animated Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="traffic-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="data-traffic-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glow-aws">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Users to Route 53 & WAF */}
            <motion.path d="M 180 305 L 210 250" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            <motion.path d="M 180 305 L 210 375" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            
            {/* Route 53 & WAF to ALB */}
            <motion.path d="M 370 250 L 460 305" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            <motion.path d="M 370 375 L 460 305" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            
            {/* ALB to EC2s */}
            <motion.path d="M 610 305 L 640 305 L 640 225 L 675 225" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            <motion.path d="M 610 305 L 640 305 L 640 425 L 675 425" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            
            {/* EC2 to RDS */}
            <motion.path d="M 830 225 L 920 225" stroke="url(#data-traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
            <motion.path d="M 830 425 L 890 425 L 890 235 L 920 235" stroke="url(#data-traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="8 8" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>

            {/* EC2 to ElastiCache */}
            <motion.path d="M 830 225 L 865 225 L 865 340 L 920 340" stroke="url(#data-traffic-glow)" strokeWidth="2.5" fill="none" strokeDasharray="6 6" className="animate-[dash_12s_linear_infinite] opacity-70" />
            <motion.path d="M 830 425 L 865 425 L 865 350 L 920 350" stroke="url(#data-traffic-glow)" strokeWidth="2.5" fill="none" strokeDasharray="6 6" className="animate-[dash_12s_linear_infinite] opacity-70" />

            {/* EC2 to S3 */}
            <motion.path d="M 830 225 L 845 225 L 845 560 L 920 560" stroke="url(#traffic-glow)" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_18s_linear_infinite] opacity-50" />
            <motion.path d="M 830 425 L 845 425 L 845 560 L 920 560" stroke="url(#traffic-glow)" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_18s_linear_infinite] opacity-50" />
          </svg>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash {
              to { stroke-dashoffset: -1000; }
            }
          `}} />

          {/* AWS Nodes in Topology */}
          <div className="relative z-10 w-full h-full">
            
            {/* Internet Users */}
            <div className="absolute left-[30px] top-[255px]">
              <AwsNode 
                title="Global Users" 
                subtitle="Clients & Browsers"
                icon={<Users className="w-8 h-8 text-sky-400" />} 
                border="border-sky-500/30" 
                bgGlow="shadow-[0_0_20px_rgba(56,189,248,0.15)]"
              />
            </div>

            {/* Edge Services */}
            <div className="absolute left-[210px] top-[195px]">
              <AwsNode 
                title="Amazon Route 53" 
                subtitle="Highly Available DNS"
                icon={<Route53Icon className="w-10 h-10 drop-shadow-md" />} 
                border="border-purple-500/40" 
                badge="DNS • Anycast"
                bgGlow="shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              />
            </div>
            
            <div className="absolute left-[210px] top-[325px]">
              <AwsNode 
                title="AWS WAF" 
                subtitle="Web App Firewall"
                icon={<WafIcon className="w-10 h-10 drop-shadow-md" />} 
                border="border-purple-500/40" 
                badge="DDoS • Bot Shield"
                bgGlow="shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              />
            </div>

            {/* Public Subnet - ALB */}
            <div className="absolute left-[460px] top-[250px]">
              <AwsNode 
                title="Application Load Balancer" 
                subtitle="HTTP/HTTPS Ingress"
                icon={<AlbIcon className="w-10 h-10 drop-shadow-md" />} 
                border="border-cyan-500/50" 
                badge="L7 Traffic Balancing"
                bgGlow="shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              />
            </div>

            {/* Private Subnet - Compute (AZ-1a and AZ-1b) */}
            <div className="absolute left-[675px] top-[170px]">
              <AwsNode 
                title="Amazon EC2 Instance" 
                subtitle="Application Server"
                icon={<Ec2Icon className="w-10 h-10 drop-shadow-md" />} 
                border="border-orange-500/40" 
                badge="AZ: us-east-1a"
                bgGlow="shadow-[0_0_20px_rgba(249,115,22,0.15)]"
              />
            </div>

            <div className="absolute left-[675px] top-[370px]">
              <AwsNode 
                title="Amazon EC2 Instance" 
                subtitle="Application Server"
                icon={<Ec2Icon className="w-10 h-10 drop-shadow-md" />} 
                border="border-orange-500/40" 
                badge="AZ: us-east-1b"
                bgGlow="shadow-[0_0_20px_rgba(249,115,22,0.15)]"
              />
            </div>

            {/* Data Subnet */}
            <div className="absolute left-[920px] top-[170px]">
              <AwsNode 
                title="Amazon RDS Multi-AZ" 
                subtitle="PostgreSQL / MySQL"
                icon={<RdsIcon className="w-10 h-10 drop-shadow-md" />} 
                border="border-blue-500/50" 
                badge="Primary + Replica"
                bgGlow="shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              />
            </div>

            <div className="absolute left-[920px] top-[290px]">
              <AwsNode 
                title="Amazon ElastiCache" 
                subtitle="In-Memory Redis Cluster"
                icon={<ElastiCacheIcon className="w-10 h-10 drop-shadow-md" />} 
                border="border-indigo-500/50" 
                badge="Sub-millisecond latency"
                bgGlow="shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              />
            </div>

            {/* Outside VPC - S3 Object Storage */}
            <div className="absolute left-[920px] top-[505px]">
              <AwsNode 
                title="Amazon S3" 
                subtitle="Object Storage Bucket"
                icon={<S3Icon className="w-10 h-10 drop-shadow-md" />} 
                border="border-green-500/50" 
                badge="Static Assets • Backups"
                bgGlow="shadow-[0_0_20px_rgba(34,197,94,0.15)]"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function AwsNode({ 
  title, 
  subtitle, 
  icon, 
  border, 
  badge,
  bgGlow = ""
}: { 
  title: string; 
  subtitle?: string; 
  icon: React.ReactNode; 
  border: string; 
  badge?: string;
  bgGlow?: string;
}) {
  return (
    <div className={`p-3.5 rounded-2xl bg-[#0c1017] border ${border} ${bgGlow} flex flex-col items-center justify-center text-center w-[160px] min-h-[110px] relative z-20 hover:scale-105 transition-all duration-300 backdrop-blur-md group cursor-default`}>
      <div className="p-1 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-xs font-bold text-white leading-tight tracking-tight">{title}</span>
      {subtitle && (
        <span className="text-[10px] text-slate-200 mt-0.5 leading-tight">{subtitle}</span>
      )}
      {badge && (
        <span className="absolute -bottom-2.5 bg-[#141b26] px-2 py-0.5 rounded-full text-[9px] font-mono text-slate-300 border border-white/15 whitespace-nowrap shadow-md">
          {badge}
        </span>
      )}
    </div>
  );
}
