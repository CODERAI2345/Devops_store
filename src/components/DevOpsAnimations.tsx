import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Server, CheckCircle2, Loader2, Container, Terminal as TerminalIcon, ShieldAlert, Cpu, Check, Activity, Rocket, Beaker, FileCode, Globe, Network } from 'lucide-react';

// =====================================================================
// 1) KUBERNETES POD SCALING ANIMATION
// =====================================================================

const POD_NAMES = [
  "web-app-7b89f-29xk1",
  "web-app-7b89f-8flp3",
  "web-app-7b89f-m5c4t",
  "web-app-7b89f-p1q9z",
];

export const K8sPods = () => {
  const [activePods, setActivePods] = useState<{index: number, id: string}[]>([]);
  const [runningPods, setRunningPods] = useState<number[]>([]);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let cycle = 0;
    
    const run = () => {
      cycle++;
      const currentCycle = cycle;
      
      setActivePods([]);
      setRunningPods([]);
      
      for (let i = 0; i < POD_NAMES.length; i++) {
        // Schedule pod
        timeouts.push(
          setTimeout(() => {
            setActivePods((prev) => [...prev, { index: i, id: `${i}-${currentCycle}` }]);
          }, i * 800 + 100) // Staggered start
        );
        
        // Mark as running
        timeouts.push(
          setTimeout(() => {
            setRunningPods((prev) => [...prev, i]);
          }, i * 800 + 2000) // Takes about 1.9s to "start"
        );
      }
    };
    run();
    const intId = setInterval(run, 12000);
    return () => {
      clearInterval(intId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] p-6 shadow-2xl relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">ReplicaSet</div>
          <span className="font-bold text-slate-200 text-lg">web-app-7b89f</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          <Server size={14} className="text-orange-400" /> 
          Cluster 1
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 min-h-[220px]">
        <AnimatePresence>
          {activePods.map((pod) => {
            const isRunning = runningPods.includes(pod.index);
            
            return (
              <motion.div
                key={pod.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-4 transition-colors duration-500 ${
                  isRunning 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-orange-500/30 bg-orange-500/5'
                }`}
              >
                {/* Floating animation for running pods */}
                <motion.div 
                  animate={isRunning ? { y: [0, -4, 0] } : { y: 0 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="mb-3 relative"
                >
                  <Container 
                    size={32} 
                    className={`transition-colors duration-500 ${isRunning ? 'text-green-400' : 'text-orange-400'}`} 
                  />
                  {/* Status badge */}
                  <div className="absolute -right-2 -bottom-2 bg-[#090d20] rounded-full p-[2px]">
                    {isRunning ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <Loader2 size={14} className="text-orange-500 animate-spin" />
                    )}
                  </div>
                </motion.div>
                
                <div className="text-center w-full">
                  <div className="text-[10px] text-slate-400 font-mono truncate w-full px-1">
                    {POD_NAMES[pod.index]}
                  </div>
                  <div className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${isRunning ? 'text-green-500' : 'text-orange-500'}`}>
                    {isRunning ? 'Running' : 'Creating...'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-green-500"
          />
          Live sync
        </span>
        <span>
          <b className="text-green-500">{runningPods.length}</b>/{POD_NAMES.length} Ready
        </span>
      </div>
    </div>
  );
};

// =====================================================================
// 2) LINUX TERMINAL LOG-SEARCH ANIMATION
// =====================================================================

export const Terminal = () => {
  const lines = [
    { text: "kops create cluster --zones=us-east-1c useast1.dev.k8s.local", type: 'cmd' },
    { text: "I0906 14:14:32.181284 1234 create_cluster.go:123] Using SSH public key", type: 'out' },
    { text: "I0906 14:14:33.204592 1234 subnets.go:184] Assigned CIDR 172.20.32.0/19", type: 'out' },
    { text: "Cluster is created.", type: 'success' },
    { text: "kubectl get nodes", type: 'cmd' },
    { text: "NAME               STATUS   ROLES    AGE   VERSION", type: 'out' },
    { text: "ip-172-20-35-1.ec2 Ready    master   2m    v1.27.3", type: 'out' },
    { text: "ip-172-20-40-2.ec2 Ready    node     1m    v1.27.3", type: 'out' },
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let currentLine = 0;
    const interval = setInterval(() => {
      currentLine++;
      setVisibleLines(currentLine);
      if (currentLine >= lines.length) {
        clearInterval(interval);
      }
    }, 600); // 600ms per line
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] shadow-2xl relative">
      <div className="flex h-8 w-full items-center gap-1.5 border-b border-white/10 bg-[#12182b] px-4">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <div className="ml-2 text-[10px] text-slate-500 font-mono">bash - admin@devops-store</div>
      </div>
      <div className="p-4 font-mono text-[11px] leading-relaxed">
        {lines.map((line, i) => {
          if (i >= visibleLines) return null;
          return (
            <motion.div 
              key={i} 
              className="mb-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {line.type === 'cmd' ? (
                <span className="text-slate-300">
                  <span className="text-green-400 mr-2">$</span>
                  {line.text}
                </span>
              ) : line.type === 'success' ? (
                <span className="text-green-400 font-semibold">{line.text}</span>
              ) : (
                <span className="text-slate-500">{line.text}</span>
              )}
            </motion.div>
          );
        })}
        {visibleLines < lines.length && (
           <motion.span 
             animate={{ opacity: [1, 0] }} 
             transition={{ repeat: Infinity, duration: 0.8 }} 
             className="inline-block w-2 h-3 bg-slate-400 ml-1 translate-y-[2px]" 
           />
        )}
      </div>
    </div>
  );
};
// =====================================================================
// 3) CI/CD PIPELINE FLOW ANIMATION
// =====================================================================
export const Pipeline = () => {
  const stages = ['Build', 'Test', 'Deploy', 'Monitor'];
  const stageNames = [
    'Building application…',
    'Running test suite…',
    'Deploying to production…',
    'Monitoring rollout…',
  ];

  const [activeStage, setActiveStage] = useState(-1);
  const [doneStages, setDoneStages] = useState<number[]>([]);
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState('Waiting to start…');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let currentCycle = 0;
    
    const run = () => {
      currentCycle++;
      setCycle(currentCycle);
      setActiveStage(-1);
      setDoneStages([]);
      setWidth(0);
      setStatus('Starting pipeline…');

      for (let i = 0; i < 4; i++) {
        timeouts.push(
          setTimeout(() => {
            setActiveStage(i);
            setStatus(stageNames[i]);
            setWidth(((i + 1) / 4) * 100);
          }, i * 1500 + 100)
        );

        timeouts.push(
          setTimeout(() => {
            setActiveStage(-1);
            setDoneStages((prev) => [...prev, i]);
          }, i * 1500 + 1400)
        );
      }

      timeouts.push(
        setTimeout(() => {
          setStatus('✓ Pipeline completed successfully');
        }, 4 * 1500 + 100)
      );
    };

    run();
    const intId = setInterval(run, 4 * 1500 + 2500);
    return () => {
      clearInterval(intId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const getIconForStage = (index: number, isActive: boolean, isDone: boolean) => {
    if (isDone) return <Check size={18} className="text-[#090d20]" />;
    
    let Icon = FileCode;
    if (index === 1) Icon = Beaker;
    if (index === 2) Icon = Rocket;
    if (index === 3) Icon = Activity;

    return (
      <Icon 
        size={18} 
        className={isActive ? 'text-green-500' : 'text-slate-500'} 
      />
    );
  };

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] px-6 py-10 shadow-2xl relative">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-[22px] right-[22px] top-[22px] z-0 h-[2px] bg-[#2a3548] overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ ease: "linear", duration: 1.4 }}
          />
        </div>
        
        {stages.map((stage, i) => {
          const isActive = activeStage === i;
          const isDone = doneStages.includes(i);
          
          return (
            <div key={stage} className="relative z-10 flex w-[70px] flex-col items-center gap-3">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isDone ? '#22c55e' : isActive ? '#0d1f14' : '#111827',
                  borderColor: isActive || isDone ? '#22c55e' : '#2a3548'
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2"
              >
                {isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    {getIconForStage(i, isActive, isDone)}
                  </motion.div>
                ) : (
                  getIconForStage(i, isActive, isDone)
                )}
              </motion.div>
              
              <div
                className={`text-center text-xs font-medium transition-colors duration-300 ${
                  isActive || isDone ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                {stage}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

// =====================================================================
// 4) CLOUD TRAFFIC ROUTING ANIMATION
// =====================================================================
export const CloudTraffic = () => {
  const [activePath, setActivePath] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let currentCycle = 0;

    const run = () => {
      currentCycle++;
      setCycle(currentCycle);

      // Path 0 -> Server 1, Path 1 -> Server 2, Path 2 -> Server 3
      const sequence = [0, 1, 2, 0, 2, 1];
      
      sequence.forEach((pathIndex, i) => {
        timeouts.push(
          setTimeout(() => {
            setActivePath(pathIndex);
          }, i * 1500)
        );
      });
    };

    run();
    const intId = setInterval(run, 6 * 1500);
    return () => {
      clearInterval(intId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d20] p-6 shadow-2xl relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cloud Traffic Routing
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-400 border border-blue-500/20 animate-pulse">
          <Activity size={12} /> Live
        </div>
      </div>

      <div className="relative h-[220px] flex flex-col items-center justify-between py-2">
        {/* User / Gateway */}
        <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#12182b] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
        </div>

        {/* Load Balancer */}
        <div className="z-10 mt-6 flex h-10 w-28 items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-[#0d152a] shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <span className="text-xs font-bold text-blue-200">ALB</span>
        </div>

        {/* Servers Grid */}
        <div className="z-10 mt-8 flex w-full justify-between px-4">
          {[0, 1, 2].map((i) => {
            const isActive = activePath === i;
            return (
              <motion.div
                key={`server-${i}`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  borderColor: isActive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(34, 197, 94, 0.1)' : '#12182b',
                }}
                transition={{ duration: 0.3 }}
                className="flex h-14 w-20 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#12182b]"
              >
                <Server size={18} className={isActive ? 'text-green-400' : 'text-slate-500'} />
                <span className={`mt-1 text-[10px] font-bold ${isActive ? 'text-green-400' : 'text-slate-500'}`}>
                  EC2-{i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Animated Packets (Gateway -> ALB) */}
        <motion.div
          key={`packet-in-${cycle}-${activePath}`}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 64, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.6, ease: "linear" }}
          className="absolute top-4 left-1/2 -ml-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
        />

        {/* Animated Packets (ALB -> Servers) */}
        <motion.div
          key={`packet-out-${cycle}-${activePath}`}
          initial={{ y: 110, x: 0, opacity: 0 }}
          animate={{ 
            y: 160, 
            x: activePath === 0 ? -110 : activePath === 1 ? 0 : 110,
            opacity: [0, 1, 1, 0] 
          }}
          transition={{ duration: 0.6, delay: 0.6, ease: "linear" }}
          className="absolute top-4 left-1/2 -ml-1 h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
        />

        {/* Connecting Lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-0" style={{ opacity: 0.15 }}>
          {/* Gateway to ALB */}
          <line x1="50%" y1="56" x2="50%" y2="88" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* ALB to EC2-1 */}
          <path d="M 50% 128 L 22% 128 L 22% 164" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
          {/* ALB to EC2-2 */}
          <line x1="50%" y1="128" x2="50%" y2="164" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
          {/* ALB to EC2-3 */}
          <path d="M 50% 128 L 78% 128 L 78% 164" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
};


