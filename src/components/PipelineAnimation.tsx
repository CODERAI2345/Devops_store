import React from 'react';
import { motion } from 'motion/react';
import { Database, Globe, Server, Users, ShieldCheck, Cloud, Network, HardDrive, Zap, Box, Lock, CheckCircle2 } from 'lucide-react';

export function PipelineAnimation() {
  return (
    <div className="relative w-full h-[640px] rounded-2xl border border-white/10 bg-[#06080a] text-slate-300 font-sans overflow-hidden flex flex-col my-12">
      <div className="flex-1 relative w-full h-full overflow-auto custom-scrollbar flex items-center justify-center min-w-[1200px] min-h-[640px]">
        {/* Topographic Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        {/* VPC Boundary */}
        <div className="absolute left-[420px] top-[120px] w-[680px] h-[370px] border-2 border-dashed border-orange-500/30 rounded-xl bg-orange-500/5 z-0 flex flex-col">
          <div className="absolute -top-3 left-6 bg-[#06080a] px-2 text-xs font-mono text-orange-400 font-semibold border border-orange-500/30 rounded">aws-vpc-production (10.0.0.0/16)</div>
        </div>

        {/* Public Subnet */}
        <div className="absolute left-[435px] top-[160px] w-[170px] h-[310px] border border-cyan-500/20 rounded-xl bg-cyan-500/5 z-0 flex flex-col">
          <div className="absolute -top-3 left-4 bg-[#06080a] px-2 text-[10px] font-mono text-cyan-400 border border-cyan-500/20 rounded">Public Subnet</div>
        </div>

        {/* Private Subnet */}
        <div className="absolute left-[630px] top-[160px] w-[200px] h-[310px] border border-purple-500/20 rounded-xl bg-purple-500/5 z-0 flex flex-col">
          <div className="absolute -top-3 left-4 bg-[#06080a] px-2 text-[10px] font-mono text-purple-400 border border-purple-500/20 rounded">Private Subnet (Compute)</div>
        </div>

        {/* Data Subnet */}
        <div className="absolute left-[850px] top-[160px] w-[230px] h-[250px] border border-emerald-500/20 rounded-xl bg-emerald-500/5 z-0 flex flex-col">
          <div className="absolute -top-3 left-4 bg-[#06080a] px-2 text-[10px] font-mono text-emerald-400 border border-emerald-500/20 rounded">Private Subnet (Data)</div>
        </div>

        {/* SVG Animated Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="traffic-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
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
          <motion.path d="M 180 305 L 200 255" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          <motion.path d="M 180 305 L 200 365" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          
          {/* Route 53 & WAF to ALB */}
          <motion.path d="M 340 255 L 450 305" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          <motion.path d="M 340 365 L 450 305" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          
          {/* ALB to EC2s */}
          <motion.path d="M 590 305 L 620 305 L 620 225 L 660 225" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          <motion.path d="M 590 305 L 620 305 L 620 415 L 660 415" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          
          {/* EC2 to RDS */}
          <motion.path d="M 800 225 L 900 225" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>
          <motion.path d="M 800 415 L 870 415 L 870 235 L 900 235" stroke="url(#traffic-glow)" strokeWidth="3" fill="none" strokeDasharray="10 10" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-aws)"/>

          {/* EC2 to ElastiCache */}
          <motion.path d="M 800 225 L 840 225 L 840 335 L 900 335" stroke="url(#traffic-glow)" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_15s_linear_infinite] opacity-60" />
          <motion.path d="M 800 415 L 840 415 L 840 345 L 900 345" stroke="url(#traffic-glow)" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_15s_linear_infinite] opacity-60" />

          {/* EC2 to S3 */}
          <motion.path d="M 800 225 L 810 225 L 810 555 L 900 555" stroke="url(#traffic-glow)" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite] opacity-40" />
          <motion.path d="M 800 415 L 810 415 L 810 555 L 900 555" stroke="url(#traffic-glow)" strokeWidth="2" fill="none" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite] opacity-40" />

        </svg>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: -1000; }
          }
        `}} />

        {/* Nodes */}
        <div className="relative z-10 w-full h-full">
          
          {/* Internet */}
          <div className="absolute left-[40px] top-[260px]">
            <AwsNode title="Users" icon={<Users className="w-5 h-5"/>} color="text-slate-400" border="border-slate-700" />
          </div>

          {/* Edge */}
          <div className="absolute left-[200px] top-[210px]">
            <AwsNode title="Amazon Route 53" icon={<Globe className="w-5 h-5"/>} color="text-purple-400" border="border-purple-500/50" />
          </div>
          <div className="absolute left-[200px] top-[320px]">
            <AwsNode title="AWS WAF" icon={<ShieldCheck className="w-5 h-5"/>} color="text-purple-400" border="border-purple-500/50" />
          </div>

          {/* Public Subnet - ALB */}
          <div className="absolute left-[450px] top-[260px]">
            <AwsNode title="Application Load Balancer" icon={<Network className="w-5 h-5"/>} color="text-cyan-400" border="border-cyan-500/50" />
          </div>

          {/* Private Subnet - Compute */}
          <div className="absolute left-[660px] top-[180px]">
            <AwsNode title="Amazon EC2 (App)" icon={<Server className="w-5 h-5"/>} color="text-orange-400" border="border-orange-500/50" info="us-east-1a" />
          </div>
          <div className="absolute left-[660px] top-[370px]">
            <AwsNode title="Amazon EC2 (App)" icon={<Server className="w-5 h-5"/>} color="text-orange-400" border="border-orange-500/50" info="us-east-1b" />
          </div>

          {/* Data Subnet */}
          <div className="absolute left-[900px] top-[180px]">
            <AwsNode title="Amazon RDS (Primary)" icon={<Database className="w-5 h-5"/>} color="text-emerald-400" border="border-emerald-500/50" />
          </div>
          <div className="absolute left-[900px] top-[290px]">
            <AwsNode title="Amazon ElastiCache" icon={<Zap className="w-5 h-5"/>} color="text-emerald-400" border="border-emerald-500/50" />
          </div>

          {/* Outside VPC - S3 */}
          <div className="absolute left-[900px] top-[510px]">
            <AwsNode title="Amazon S3" icon={<HardDrive className="w-5 h-5"/>} color="text-green-400" border="border-green-500/50" info="Bucket" />
          </div>

        </div>
      </div>
    </div>
  );
}

function AwsNode({ title, icon, color, border, info }: { title: string, icon: React.ReactNode, color: string, border: string, info?: string }) {
  return (
    <div className={`p-4 rounded-xl bg-[#0d1117] border ${border} shadow-lg shadow-black/50 flex flex-col items-center justify-center gap-2 w-[140px] h-[90px] relative z-20 hover:scale-105 transition-transform backdrop-blur-sm`}>
      <div className={`p-2 rounded-lg bg-[#161b22] border border-white/5 ${color}`}>
        {icon}
      </div>
      <span className="text-[11px] font-semibold text-slate-300 text-center leading-tight">{title}</span>
      {info && (
        <span className="absolute -bottom-2.5 bg-[#161b22] px-2 py-0.5 rounded text-[9px] font-mono text-slate-500 border border-white/10 whitespace-nowrap shadow-sm">
          {info}
        </span>
      )}
    </div>
  );
}
