import { PipelineAnimation } from "./PipelineAnimation";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { LogoIcon } from './LogoIcon';
import { UserNav } from './UserNav';
import { useAuth } from '../context/AuthContext';
import { K8sPods, Terminal, Pipeline, CloudTraffic } from './DevOpsAnimations';
import {
  AwsLogo,
  KubernetesSvg,
  DockerSvg,
  TerraformSvg,
  GithubActionsSvg,
  LinuxSvg
} from './AwsIcons';
import {
  Armchair,
  ArrowRight,
  BookOpen,
  Box,
  Cloud,
  Code2,
  Container,
  Github,
  GraduationCap,
  Heart,
  Instagram,
  Link,
  Linkedin,
  Mail,
  Menu,
  Monitor,
  Network,
  Search,
  Server,
  Settings,
  Shield,
  Sun,
  Users,
  X,
  Youtube,
  FileText,
  Sparkles,
  CheckCircle2,
  Layers,
} from "lucide-react";

const domains: { name: string; icon: React.ReactNode; color: string }[] = [
  {
    name: "AWS Cloud",
    icon: <AwsLogo className="w-7 h-5" />,
    color: "from-orange-500/20 to-amber-500/10",
  },
  {
    name: "Kubernetes",
    icon: <KubernetesSvg className="w-7 h-7" />,
    color: "from-blue-600/30 to-cyan-500/10",
  },
  {
    name: "Docker",
    icon: <DockerSvg className="w-7 h-7" />,
    color: "from-sky-500/30 to-blue-500/10",
  },
  {
    name: "Terraform",
    icon: <TerraformSvg className="w-7 h-7" />,
    color: "from-purple-600/30 to-violet-500/10",
  },
  {
    name: "GitHub Actions",
    icon: <GithubActionsSvg className="w-7 h-7" />,
    color: "from-indigo-500/30 to-purple-500/10",
  },
  {
    name: "Linux Systems",
    icon: <LinuxSvg className="w-7 h-7" />,
    color: "from-yellow-500/30 to-orange-500/10",
  },
  {
    name: "CI/CD Pipelines",
    icon: <span className="text-emerald-400 font-black text-xl">∞</span>,
    color: "from-emerald-500/30 to-teal-500/10",
  },
  {
    name: "Monitoring",
    icon: <span className="text-pink-400 font-bold text-lg">▥</span>,
    color: "from-pink-500/30 to-rose-500/10",
  },
  {
    name: "SRE & Reliability",
    icon: <span className="text-violet-400 font-bold text-lg">⬡</span>,
    color: "from-violet-500/30 to-red-500/10",
  },
  {
    name: "Cloud Security",
    icon: <Shield className="w-6 h-6 text-cyan-400" />,
    color: "from-cyan-500/30 to-blue-500/10",
  },
];

const features = [
  {
    title: "Build Your Toolkit",
    description:
      "Save tutorials, blogs, GitHub repositories, commands, and useful links in one organized place.",
    icon: BookOpen,
    color: "from-purple-500/20 to-violet-500/5",
    iconColor: "text-purple-400",
  },
  {
    title: "Curated by Experts",
    description:
      "Discover carefully selected tutorials and resources to grow your DevOps skills.",
    icon: GraduationCap,
    color: "from-violet-500/20 to-amber-500/5",
    iconColor: "text-fuchsia-400",
  },
  {
    title: "Tools & Templates You Need",
    description:
      "Collect tools, templates, snippets, and architectures for real-world use.",
    icon: Code2,
    color: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-400",
  },
  {
    title: "Grow Together",
    description:
      "Share useful knowledge, help others, and grow together as a DevOps community.",
    icon: Users,
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400",
  },
];

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


function StaggerContainer({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: delay } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const HERO_ROTATING_WORDS = ["Engineers", "Architects", "Builders", "Specialists", "Practitioners"];

export function WordScrollFade({
  words = HERO_ROTATING_WORDS,
  duration = 2600,
  className = "",
}: {
  words?: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className={`inline-block relative overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -22, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block bg-gradient-to-r from-amber-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent underline decoration-fuchsia-400/40 decoration-2 underline-offset-8"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function LandingPage({ setView, onSelectTab }: { setView: (v: string) => void; onSelectTab?: (tab: string) => void }) {
  const { user, openAuthModal } = useAuth();
  const [pendingTargetTab, setPendingTargetTab] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterFeedback, setNewsletterFeedback] = useState<{ msg: string; err?: boolean } | null>(null);

  // If user signs in after requesting to browse library, automatically navigate to feed
  React.useEffect(() => {
    if (user && pendingTargetTab !== null) {
      if (pendingTargetTab && onSelectTab) {
        onSelectTab(pendingTargetTab);
      }
      setView('feed');
      setPendingTargetTab(null);
    }
  }, [user, pendingTargetTab, onSelectTab, setView]);

  const handleBrowseLibrary = (targetTab: string = '') => {
    if (!user) {
      setPendingTargetTab(targetTab || '');
      openAuthModal('login', 'Please sign in with GitHub, Google, or your Mobile number to access the free DevOps library.');
      return;
    }
    if (targetTab && onSelectTab) {
      onSelectTab(targetTab);
    }
    setView('feed');
  };

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenu) {
        setMobileMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenu]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterFeedback({ msg: "Please enter a valid email address.", err: true });
      setTimeout(() => setNewsletterFeedback(null), 3500);
      return;
    }
    setNewsletterFeedback({ msg: "Thanks for subscribing to DevOps updates!", err: false });
    setNewsletterEmail("");
    setTimeout(() => setNewsletterFeedback(null), 4000);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#0B0F19] to-[#050810]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-3">
            <LogoIcon size={44} />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                DevOps <span className="text-fuchsia-400">Store</span>
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                Free Engineering & Cloud Knowledge Hub
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-7 text-sm text-slate-100 md:flex">
            <a href="#domains" className="hover:text-fuchsia-400 transition-colors">
              Domains
            </a>
            <a href="#overview" className="hover:text-fuchsia-400 transition-colors">
              What's Inside
            </a>
            <a href="#architecture" className="hover:text-fuchsia-400 transition-colors">
              AWS Architecture
            </a>
            <a href="#learn" className="hover:text-fuchsia-400 transition-colors">
              Why CentralHub
            </a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <UserNav />

            <button
              onClick={() => setView('admin')}
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
              className="rounded-full border border-white/10 p-3 text-slate-100 hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <Settings size={18} />
            </button>

            <div className="relative inline-flex group rounded-xl">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90" />
              </div>
              <button
                onClick={() => handleBrowseLibrary()}
                className="relative m-[2px] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-violet-900 to-fuchsia-900 px-5 py-3 text-sm font-semibold transition hover:from-violet-800 hover:to-fuchsia-800 shadow-lg shadow-fuchsia-900/30 cursor-pointer"
              >
                Browse Free Library <ArrowRight size={16} className="text-fuchsia-300" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 text-slate-100 hover:text-white"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {mobileMenu && (
          <div className="border-t border-white/10 bg-[#0d1128] px-6 py-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-5 text-slate-100">
              <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-white/50">Your Account</span>
                <UserNav />
              </div>
              <a href="#domains" onClick={() => setMobileMenu(false)} className="hover:text-fuchsia-400 transition-colors">Domains</a>
              <a href="#overview" onClick={() => setMobileMenu(false)} className="hover:text-fuchsia-400 transition-colors">What's Inside</a>
              <a href="#architecture" onClick={() => setMobileMenu(false)} className="hover:text-fuchsia-400 transition-colors">AWS Architecture</a>
              <a href="#learn" onClick={() => setMobileMenu(false)} className="hover:text-fuchsia-400 transition-colors">Why CentralHub</a>
              <button
                onClick={() => {
                  setMobileMenu(false);
                  setView('admin');
                }}
                className="flex items-center gap-2 text-left text-slate-300 hover:text-white transition-colors"
              >
                <Settings size={16} /> Admin Portal
              </button>
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleBrowseLibrary();
                }}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-fuchsia-900/30 cursor-pointer"
              >
                Browse Free Library <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <FadeIn>
        <div className="absolute left-0 top-0 h-[600px] w-full animate-[pulse_6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_85%_30%,rgba(249,115,22,0.35),transparent_25%),radial-gradient(circle_at_45%_30%,rgba(139,92,246,0.25),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          
          {/* LEFT */}
          <StaggerContainer>
            <StaggerItem className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-xs md:text-sm font-medium text-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
              <Sparkles size={15} className="text-fuchsia-400" />
              100% Free Curated DevOps & Cloud Resource Library
            </StaggerItem>

            <StaggerItem className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              <span>The Complete Knowledge Hub for</span>
              <br />
              <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-amber-300 bg-clip-text text-transparent inline-block mt-2">
                DevOps & Cloud{" "}
              </span>{" "}
              <WordScrollFade words={["Engineers", "Architects", "Builders", "Specialists", "Practitioners"]} />
            </StaggerItem>

            <StaggerItem>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-200">
                Stop juggling dozens of bookmarked tabs and scattered tutorials. Access curated <strong>AWS production architectures</strong>, <strong>battle-tested GitHub IaC templates</strong>, <strong>video deep-dives</strong>, and <strong>direct talent network hiring emails</strong> — completely free.
              </p>
            </StaggerItem>

            <StaggerItem className="mt-8 flex flex-wrap items-center gap-4">
              <div className="relative inline-flex group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/40 rounded-xl">
                {/* Outer animated spark wrapper */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90" />
                </div>
                {/* Inner Button */}
                <button
                  onClick={() => handleBrowseLibrary()}
                  className="relative m-[2px] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-violet-900 to-fuchsia-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:from-violet-800 hover:to-fuchsia-800 shadow-xl cursor-pointer"
                >
                  Browse Free Library <ArrowRight size={16} className="text-fuchsia-300" />
                </button>
              </div>

              <a
                href="#overview"
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-sm font-medium text-slate-200 transition-all"
              >
                <Layers size={16} className="text-fuchsia-400" />
                See What's Inside
              </a>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-8 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  No sign-up required
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Curated & Verified
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Free & Open Access
                </span>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* RIGHT WORKSPACE */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600/15 blur-3xl" />

            <div className="relative">
              <CloudTraffic />
              
              {/* Floating Hero Metric Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -top-10 -left-10 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.15)] hidden md:flex"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-fuchsia-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">100+</p>
                  <p className="text-xs text-slate-200">Curated Guides</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-10 -right-5 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.15)] hidden md:flex"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <Server size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Real-world</p>
                  <p className="text-xs text-slate-200">Architectures</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
              </FadeIn>
      </section>

      {/* ================= 30-SECOND OVERVIEW: WHAT IS THIS WEBSITE? ================= */}
      <section id="overview" className="border-t border-b border-white/10 bg-[#070b14] py-16 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> What Is Inside DevOps Store?
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Everything in One Unified Feed
              </h2>
              <p className="mt-2 text-slate-300 text-sm md:text-base max-w-2xl">
                Not an e-commerce shop. We are a free, community-powered engineering archive curated with real-world infrastructure assets:
              </p>
            </div>

            <button
              onClick={() => handleBrowseLibrary()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-sm font-semibold text-white transition-all w-fit cursor-pointer"
            >
              Open Live Resource Desk <ArrowRight className="w-4 h-4 text-fuchsia-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Cloud Architecture */}
            <div
              onClick={() => {
                document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer rounded-2xl border border-orange-500/20 bg-gradient-to-b from-orange-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                  Live Topologies
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                AWS & Cloud Architectures
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Interactive topologies showing Route 53, ALB, EC2, RDS, and ElastiCache pipelines with step-by-step traffic packet flows.
              </p>
            </div>

            {/* Card 2: GitHub IaC */}
            <div
              onClick={() => handleBrowseLibrary('git')}
              className="group cursor-pointer rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Github className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Ready-to-Deploy
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                GitHub IaC & Repositories
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Production-grade Terraform modules, Docker compose files, Kubernetes manifests, and CI/CD pipelines ready to clone.
              </p>
            </div>

            {/* Card 3: Video Tutorials & Playlists */}
            <div
              onClick={() => handleBrowseLibrary('ypl')}
              className="group cursor-pointer rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Youtube className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseLibrary('ypl');
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 cursor-pointer"
                  >
                    Playlists
                  </span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseLibrary('yt');
                    }}
                    className="text-xs font-semibold px-2 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 cursor-pointer"
                  >
                    Videos
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
                YouTube Playlists & Guides
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Handpicked course playlists and video breakdowns covering system design, cloud failure scenarios, debugging sessions, and Kubernetes tips.
              </p>
            </div>

            {/* Card 4: Recruiter Emails */}
            <div
              onClick={() => handleBrowseLibrary('email')}
              className="group cursor-pointer rounded-2xl border border-fuchsia-500/20 bg-gradient-to-b from-fuchsia-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-[0_8px_30px_rgba(217,70,239,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                  Direct Hiring Contacts
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                Company Talent Directory
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Verified recruiter emails and talent network access points from tech companies actively hiring DevOps & SRE talent.
              </p>
            </div>

            {/* Card 5: Technical Blogs */}
            <div
              onClick={() => handleBrowseLibrary('blog')}
              className="group cursor-pointer rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Architecture Case Studies
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                In-Depth Technical Blogs
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Real-world outage retrospectives, scaling blueprints, zero-trust network configurations, and observability guides.
              </p>
            </div>

            {/* Card 6: Interactive Cheatsheets */}
            <div
              onClick={() => handleBrowseLibrary('lab')}
              className="group cursor-pointer rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Quick Reference
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Linux & System Cheatsheets
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Copy-pasteable one-liners, kubectl commands, Docker network setups, and system diagnostic commands for high-pressure incident response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KUBERNETES ANIMATION ================= */}
      <section className="border-t border-white/10 bg-[#04060e] py-24">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scale with <span className="text-fuchsia-400">Confidence</span>
            </h2>
            <p className="text-lg text-slate-200 leading-relaxed">
              Master Kubernetes orchestration. Watch as your pods automatically scale across healthy nodes, ensuring high availability and robust performance for your applications. Learn the essential strategies for resilient infrastructure.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px]">
              <K8sPods />
            </div>
          </div>
        </div>
              </FadeIn>
      </section>


      {/* ================= AWS CLOUD TOPOLOGY & ARCHITECTURE ================= */}
      <section id="architecture" className="border-t border-white/10 bg-[#0a060f] py-24 overflow-hidden scroll-mt-16">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 flex flex-col gap-12">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <AwsLogo className="w-5 h-3.5" /> High-Availability Infrastructure
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">AWS Architecture</span>
            </h2>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Explore the live architecture with official AWS service iconography. Trace packets from Route 53 and AWS WAF through the Application Load Balancer into private Multi-AZ EC2 compute, ElastiCache, RDS, and S3.
            </p>
          </div>
          <div className="w-full flex justify-center mt-4">
            <PipelineAnimation />
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ================= EXPLORE CATALOGS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 relative z-10 border-t border-white/10">
        <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our <span className="text-fuchsia-400">Deep Catalogs</span>
          </h2>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            Everything you need to level up your engineering career. From technical tutorials to exclusive company insights, all curated in one central hub.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem className="md:col-span-2">{/* Main Feature: Career Emails */}
          <div className="relative h-full group rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#16110f] to-[#0a0808] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mail className="w-48 h-48 text-fuchsia-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Company Career Emails</h3>
              <p className="text-slate-200 max-w-md mb-8">
                Get an inside look at how top engineering teams operate. Real insights, culture breakdowns, and direct access to talent network opportunities.
              </p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-sm font-medium border border-orange-500/20">
                  47+ Archives
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.03] text-slate-100 text-sm font-medium border border-white/10">
                  Updated Weekly
                </span>
              </div>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Secondary: GitHub */}
          <div className="relative group rounded-2xl border border-white/10 bg-[#0d1117] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/10">
                <Github className="w-6 h-6 text-slate-100" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">GitHub Repos</h3>
              <p className="text-slate-200 mb-6 text-sm">
                Production-ready templates, IaC modules, and curated open-source tools.
              </p>
              <span className="px-3 py-1 rounded-full bg-white/[0.03] text-slate-100 text-sm font-medium border border-white/10">
                11 Repositories
              </span>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: YouTube & Playlists */}
          <div 
            onClick={() => handleBrowseLibrary('ypl')}
            className="relative group rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#1a0f0f] to-[#0a0505] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)] cursor-pointer"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <Youtube className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Video Playlists & Tutorials</h3>
              <p className="text-slate-200 mb-6 text-sm">
                Deep-dive architectural breakdowns, complete courses, and hands-on deployment playlists.
              </p>
              <div className="flex gap-2">
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseLibrary('ypl');
                  }}
                  className="px-3 py-1 rounded-full bg-red-600/20 text-red-300 text-sm font-medium border border-red-500/30 hover:bg-red-600/30 transition-colors cursor-pointer"
                >
                  Playlists
                </span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseLibrary('yt');
                  }}
                  className="px-3 py-1 rounded-full bg-white/[0.03] text-slate-100 text-sm font-medium border border-white/10 hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  Videos
                </span>
              </div>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: Technical Blogs */}
          <div className="relative group rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0f171a] to-[#05080a] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Technical Blogs</h3>
              <p className="text-slate-200 mb-6 text-sm">
                System design concepts, post-mortems, and engineering best practices.
              </p>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
                37 Articles
              </span>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: LinkedIn */}
          <div className="relative group rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0f141a] to-[#05080a] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Linkedin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Network Posts</h3>
              <p className="text-slate-200 mb-6 text-sm">
                Bite-sized industry updates, career advice, and community discussions.
              </p>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                20 Posts
              </span>
            </div>
          </div>
                  </StaggerItem>
        </StaggerContainer>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => handleBrowseLibrary()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-fuchsia-900/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Access All Catalogs & Resources <ArrowRight className="w-5 h-5" />
          </button>
        </div>
              </FadeIn>
      </section>

      {/* ================= WHY ================= */}
      <section id="learn" className="mx-auto max-w-7xl px-6 py-24">
        <FadeIn>
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold">
            Why{" "}
            <span className="text-fuchsia-400">
              DevOps Store?
            </span>
          </h2>

          <p className="mt-4 text-slate-200">
            Everything you need to learn, build, and grow in your DevOps
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          
          {/* Box 1 (Large - 2x2) */}
          <div className="group md:col-span-2 md:row-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 relative overflow-hidden flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-8 text-fuchsia-500/20 group-hover:text-fuchsia-500/40 transition-colors duration-500">
              <Container size={120} strokeWidth={1} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-fuchsia-500/20 p-3">
                <BookOpen className="text-fuchsia-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Build Your Toolkit</h3>
              <p className="text-slate-200 max-w-sm leading-relaxed">
                Save tutorials, blogs, GitHub repositories, commands, and useful links in one organized place. Stop losing track of that one perfect guide you found.
              </p>
            </div>
          </div>

          {/* Box 2 (1x1) */}
          <div className="group md:col-span-1 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/30 flex flex-col justify-between">
            <div className="inline-flex rounded-xl bg-violet-500/20 p-3 w-fit">
              <GraduationCap className="text-violet-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Curated by Experts</h3>
              <p className="text-sm text-slate-200">
                Carefully selected tutorials and resources to accelerate your growth.
              </p>
            </div>
          </div>

          {/* Box 3 (1x1) */}
          <div className="group lg:col-span-1 md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 flex flex-col justify-between">
            <div className="inline-flex rounded-xl bg-blue-500/20 p-3 w-fit">
              <Code2 className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Tools & Templates</h3>
              <p className="text-sm text-slate-200">
                Collect snippets, and architectures for real-world production use.
              </p>
            </div>
          </div>

          {/* Box 4 (Wide - 2x1) */}
          <div className="group md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 relative overflow-hidden flex flex-col justify-center">
             <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500">
              <Network size={160} strokeWidth={1} />
            </div>
            <div className="relative z-10 max-w-sm">
              <div className="mb-4 inline-flex rounded-xl bg-emerald-500/20 p-3">
                <Users className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Grow Together</h3>
              <p className="text-slate-200">
                Share useful knowledge, help others, and grow together as a DevOps community.
              </p>
            </div>
          </div>

        </div>
        </FadeIn>
      </section>

      {/* ================= TERMINAL ANIMATION ================= */}
      <section className="border-t border-white/10 bg-[#04060e] py-24">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="w-full max-w-[420px]">
              <Terminal />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Master the <span className="text-fuchsia-400">Terminal</span>
            </h2>
            <p className="text-lg text-slate-200 leading-relaxed">
              Get comfortable with the command line. Learn essential Linux commands, bash scripting, and log analysis to troubleshoot and optimize your systems effectively without leaving the keyboard.
            </p>
          </div>
        </div>
        </FadeIn>
      </section>
      {/* ================= DOMAINS ================= */}
      <section id="domains" className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400">
              Explore
            </p>

            <h2 className="text-4xl font-bold">
              DevOps <span className="text-fuchsia-400">Domains</span>
            </h2>
          </div>

          <button
            onClick={() => handleBrowseLibrary()}
            className="flex items-center gap-2 text-fuchsia-400 hover:text-orange-300 transition-colors cursor-pointer"
          >
            View all resources <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {domains.map((domain) => (
            <button
              key={domain.name}
              onClick={() => handleBrowseLibrary('lab')}
              className={`group flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-br ${domain.color} p-5 text-left transition hover:-translate-y-1 hover:border-white/25 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{domain.icon}</span>
                <span className="font-semibold">{domain.name}</span>
              </div>

              <ArrowRight
                size={17}
                className="text-slate-200 transition group-hover:translate-x-1 group-hover:text-fuchsia-400"
              />
            </button>
          ))}
        </div>
              </FadeIn>
      </section>

      {/* ================= PIPELINE ANIMATION ================= */}
      <section className="border-t border-white/10 bg-[#04060e] py-24">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Automate your <span className="text-fuchsia-400">Pipelines</span>
            </h2>
            <p className="text-lg text-slate-200 leading-relaxed">
              Streamline your development lifecycle. Build, test, and deploy faster with robust CI/CD pipelines that catch errors early and ship code securely to production.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px]">
              <Pipeline />
            </div>
          </div>
        </div>
              </FadeIn>
      </section>

      {/* ================= SHARE ================= */}
      <section id="resources" className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#17103a] via-[#1a0a22] to-[#31102f] p-8 md:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              {/* Electric Logo Animation Section */}
              <div className="relative mb-8 inline-flex items-center justify-center p-6">
                {/* SVG Filter Definition */}
                <svg width="0" height="0" className="absolute w-0 h-0">
                  <filter id="electric-wave" x="-50%" y="-50%" width="200%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise">
                      <animate attributeName="baseFrequency" values="0.04;0.05;0.04" dur="2s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                    
                    <feGaussianBlur in="displaced" stdDeviation="3" result="blur1" />
                    <feGaussianBlur in="displaced" stdDeviation="1" result="blur2" />
                    
                    <feComponentTransfer in="blur1" result="glow">
                      <feFuncA type="linear" slope="2" />
                    </feComponentTransfer>

                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="displaced" />
                    </feMerge>
                  </filter>
                </svg>

                {/* Animated Electric Border */}
                <div 
                  className="absolute inset-0 rounded-full border-[3px] border-orange-500"
                  style={{ filter: "url(#electric-wave)", animation: "electric-pulse 2.5s ease-in-out infinite" }}
                />
                
                {/* Secondary inner rotating border for extra dynamism */}
                <div 
                  className="absolute inset-2 rounded-full border border-orange-400/50 border-dashed"
                  style={{ animation: "spin-slow 6s linear infinite" }}
                />

                {/* Centered Image / Logo */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black/20 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  <LogoIcon size={40} className="text-fuchsia-400" />
                </div>
              </div>

              <h2 className="text-4xl font-bold leading-tight">
                Have Something Useful
                <br />
                to <span className="text-fuchsia-400">Share?</span>
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-slate-100">
                Found a helpful DevOps link, tutorial, article, tool, or have a
                question? Forward it and help make DevOps Store more useful for
                everyone.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur">
              <a
                href="https://forms.gle/9K951bFHCiGWfTMQA"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:from-violet-500 hover:to-fuchsia-500"
              >
                Click here
                <ArrowRight size={18} />
              </a>

              <p className="mt-5 text-sm text-slate-200">
                Your contribution helps other DevOps learners discover valuable
                knowledge. ❤️
              </p>
            </div>
          </div>
        </div>
              </FadeIn>
      </section>

      {/* ================= FOOTER ================= */}
      
      {/* ================= FINAL CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Ready to explore the <span className="text-fuchsia-400">DevOps Store?</span>
          </h2>
          <div className="flex justify-center">
            <div className="mt-9 flex flex-wrap gap-4">
                <div className="relative inline-flex group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/40 rounded-xl">
                  {/* Outer animated spark wrapper */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90" />
                  </div>
                  {/* Inner Button */}
                  <button
                    onClick={() => handleBrowseLibrary()}
                    className="relative m-[2px] flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-violet-900 to-fuchsia-900 px-6 py-4 font-semibold text-white transition-colors hover:from-violet-800 hover:to-fuchsia-800 cursor-pointer"
                  >
                    Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-fuchsia-300" />
                  </button>
                </div>
              </div>
          </div>
        </FadeIn>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="about" className="border-t border-white/10 bg-[#060816]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <LogoIcon size={32} />
              <h3 className="text-xl font-bold tracking-tight">
                DevOps <span className="text-fuchsia-400">Store</span>
              </h3>
            </div>

            <p className="mt-5 leading-7 text-slate-200">
              Connect with me on these platforms
            </p>

            <div className="mt-6 flex gap-3">
              <a href="https://www.linkedin.com/in/mahidhara-kailash-850611144/" target="_blank" rel="noreferrer" title="LinkedIn Profile" aria-label="LinkedIn Profile" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/[0.05] overflow-hidden transition-colors">
                <img src="/linkedin-app-icon.webp" alt="LinkedIn" className="w-6 h-6 object-cover" />
              </a>
              <a href="https://www.instagram.com/devops_learnings/" target="_blank" rel="noreferrer" title="Instagram Profile" aria-label="Instagram Profile" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/[0.05] overflow-hidden transition-colors">
                <Instagram className="w-5 h-5 text-pink-400" />
              </a>
              <a href="mailto:suryakailash.mahidhara@gmail.com" title="Email Suryakailash" aria-label="Email Suryakailash" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/[0.05] transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={[
              { label: "All Resources", onClick: () => handleBrowseLibrary() },
              { label: "Guides", onClick: () => handleBrowseLibrary('yt') },
              { label: "Tutorials", onClick: () => handleBrowseLibrary('ypl') },
              { label: "Tools", onClick: () => handleBrowseLibrary('web') },
              { label: "Cheat Sheets", onClick: () => handleBrowseLibrary('lab') },
            ]}
          />

          <FooterColumn
            title="Learn & Grow"
            links={[
              { label: "Learning Paths", onClick: () => handleBrowseLibrary('blog') },
              { label: "Best Practices", onClick: () => handleBrowseLibrary('blog') },
              { label: "Hands-on Labs", onClick: () => handleBrowseLibrary('lab') },
              { label: "DevOps Roadmap", onClick: () => handleBrowseLibrary('git') },
            ]}
          />

          <FooterColumn
            title="DevOps Domains"
            links={[
              { label: "Kubernetes", onClick: () => { document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' }); } },
              { label: "Cloud", onClick: () => { document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' }); } },
              { label: "CI/CD", onClick: () => { document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' }); } },
              { label: "Infrastructure", onClick: () => { document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' }); } },
              { label: "Observability", onClick: () => { document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' }); } },
            ]}
          />

          <div>
            <h4 className="font-bold">Stay Updated</h4>

            <p className="mt-4 text-sm leading-6 text-slate-200">
              Get useful DevOps resources and updates in your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-5 flex flex-col gap-2">
              <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 focus-within:border-fuchsia-500/50 transition-colors">
                <input
                  type="email"
                  aria-label="Enter your email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-200"
                />

                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 transition hover:from-violet-500 hover:to-fuchsia-500 cursor-pointer"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              {newsletterFeedback && (
                <div className={`text-xs px-2 font-medium ${newsletterFeedback.err ? "text-red-400" : "text-emerald-400"}`}>
                  {newsletterFeedback.msg}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm text-slate-200">
          © 2026 DevOps Store. Built with{" "}
          <span className="text-fuchsia-400">♥</span> for DevOps Learners.
        </div>
      </footer>
    </main>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; onClick?: () => void }> }) {
  return (
    <div>
      <h4 className="font-bold">{title}</h4>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={link.onClick}
            className="text-left text-sm text-slate-200 transition hover:text-fuchsia-400 cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
