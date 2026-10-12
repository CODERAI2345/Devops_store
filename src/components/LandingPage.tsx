import { PipelineAnimation } from "./PipelineAnimation";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { LogoIcon } from './LogoIcon';
import { UserNav } from './UserNav';
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
  Shield,
  Sun,
  Moon,
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
  isLight = false,
}: {
  words?: string[];
  duration?: number;
  className?: string;
  isLight?: boolean;
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
          className={`inline-block bg-gradient-to-r bg-clip-text text-transparent underline decoration-2 underline-offset-8 ${
            isLight
              ? "from-violet-700 via-fuchsia-600 to-indigo-600 decoration-violet-400/50"
              : "from-amber-300 via-fuchsia-300 to-violet-300 decoration-fuchsia-400/40"
          }`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function LandingPage({ setView, onSelectTab }: { setView: (v: string) => void; onSelectTab?: (tab: string) => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('landing_theme');
      if (saved === 'dark') return 'dark';
    }
    return 'light'; // Default to white background with violet theme
  });
  const isLight = theme === 'light';

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('landing_theme', next);
    }
  };

  const [mobileMenu, setMobileMenu] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterFeedback, setNewsletterFeedback] = useState<{ msg: string; err?: boolean } | null>(null);

  const handleBrowseLibrary = (targetTab: string = '') => {
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
    <main className={`min-h-screen overflow-hidden transition-colors duration-300 relative ${
      isLight ? "bg-[#FAF9FE] text-slate-900" : "bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white"
    }`}>
      {/* Light Background Subtle Violet Radial Accents */}
      {isLight && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.08]" />
          <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-gradient-to-br from-violet-200/40 via-fuchsia-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-200/25 via-violet-100/35 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* ================= NAVBAR ================= */}
      <header className={`sticky top-0 z-50 transition-colors border-b backdrop-blur-xl ${
        isLight
          ? "bg-white/85 border-violet-100 shadow-[0_2px_15px_rgba(139,92,246,0.05)]"
          : "border-white/10 bg-gradient-to-b from-[#0B0F19] to-[#050810]/80"
      }`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:py-5">
          <a href="#" className="flex items-center gap-3">
            <LogoIcon size={44} />
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                DevOps <span className={isLight ? "text-violet-600 font-extrabold" : "text-fuchsia-400"}>Store</span>
              </h1>
              <p className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-300"}`}>
                Free Engineering & Cloud Knowledge Hub
              </p>
            </div>
          </a>

          <div className={`hidden items-center gap-7 text-sm font-medium md:flex ${isLight ? "text-slate-600" : "text-slate-100"}`}>
            <a href="#domains" className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>
              Domains
            </a>
            <a href="#overview" className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>
              What's Inside
            </a>
            <a href="#architecture" className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>
              AWS Architecture
            </a>
            <a href="#learn" className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>
              Why CentralHub
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode (White + Violet)"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isLight
                  ? "bg-violet-50 hover:bg-violet-100/90 text-violet-700 border-violet-200 shadow-xs"
                  : "bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border-white/10"
              }`}
            >
              {isLight ? (
                <>
                  <Moon size={14} className="text-violet-600" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun size={14} className="text-amber-300" />
                  <span>Light</span>
                </>
              )}
            </button>

            <UserNav isLight={isLight} />

            <div className="relative inline-flex group rounded-xl">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className={`absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] ${
                  isLight
                    ? "bg-[conic-gradient(from_90deg_at_50%_50%,#e0e7ff_0%,#c084fc_50%,#7c3aed_80%,#e0e7ff_100%)] opacity-80"
                    : "bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90"
                }`} />
              </div>
              <button
                onClick={() => handleBrowseLibrary()}
                className={`relative m-[2px] flex items-center gap-2 rounded-[10px] px-5 py-2.5 sm:py-3 text-sm font-semibold transition cursor-pointer text-white shadow-lg ${
                  isLight
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-500/25"
                    : "bg-gradient-to-r from-violet-900 to-fuchsia-900 hover:from-violet-800 hover:to-fuchsia-800 shadow-fuchsia-900/30"
                }`}
              >
                Browse Free Library <ArrowRight size={16} className="text-fuchsia-200" />
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              title="Toggle Theme"
              className={`p-2 rounded-lg border transition-colors ${
                isLight ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-white/5 border-white/10 text-white"
              }`}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} className="text-amber-300" />}
            </button>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle mobile menu"
              className={`p-2 transition-colors ${isLight ? "text-slate-800 hover:text-violet-600" : "text-slate-100 hover:text-white"}`}
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {mobileMenu && (
          <div className={`border-t px-6 py-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 ${
            isLight ? "border-violet-100 bg-white/95 text-slate-800" : "border-white/10 bg-[#0d1128] text-slate-100"
          }`}>
            <div className="flex flex-col gap-5">
              <div className={`pb-3 border-b flex items-center justify-between ${isLight ? "border-slate-100" : "border-white/10"}`}>
                <span className={`text-xs uppercase tracking-wider ${isLight ? "text-slate-500" : "text-white/50"}`}>Your Account</span>
                <UserNav isLight={isLight} />
              </div>
              <a href="#domains" onClick={() => setMobileMenu(false)} className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>Domains</a>
              <a href="#overview" onClick={() => setMobileMenu(false)} className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>What's Inside</a>
              <a href="#architecture" onClick={() => setMobileMenu(false)} className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>AWS Architecture</a>
              <a href="#learn" onClick={() => setMobileMenu(false)} className={`transition-colors ${isLight ? "hover:text-violet-600" : "hover:text-fuchsia-400"}`}>Why CentralHub</a>
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
        <div className={`absolute left-0 top-0 h-[600px] w-full animate-[pulse_6s_ease-in-out_infinite] ${
          isLight
            ? "bg-[radial-gradient(circle_at_85%_30%,rgba(249,115,22,0.12),transparent_35%),radial-gradient(circle_at_35%_30%,rgba(139,92,246,0.14),transparent_35%)]"
            : "bg-[radial-gradient(circle_at_85%_30%,rgba(249,115,22,0.35),transparent_25%),radial-gradient(circle_at_45%_30%,rgba(139,92,246,0.25),transparent_30%)]"
        }`} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-2">
          
          {/* LEFT */}
          <StaggerContainer>
            <StaggerItem className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs md:text-sm font-medium ${
              isLight
                ? "border-violet-200 bg-violet-50 text-violet-800 shadow-xs"
                : "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.15)]"
            }`}>
              <Sparkles size={15} className={isLight ? "text-violet-600" : "text-fuchsia-400"} />
              100% Free Curated DevOps & Cloud Resource Library
            </StaggerItem>

            <StaggerItem className={`max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              <span>The Complete Knowledge Hub for</span>
              <br />
              <span className={`bg-gradient-to-r inline-block mt-2 bg-clip-text text-transparent ${
                isLight ? "from-violet-600 via-fuchsia-600 to-amber-600" : "from-fuchsia-400 via-violet-400 to-amber-300"
              }`}>
                DevOps & Cloud{" "}
              </span>{" "}
              <WordScrollFade isLight={isLight} words={["Engineers", "Architects", "Builders", "Specialists", "Practitioners"]} />
            </StaggerItem>

            <StaggerItem>
              <p className={`mt-6 max-w-xl text-base sm:text-lg leading-relaxed ${
                isLight ? "text-slate-600 font-normal" : "text-slate-200"
              }`}>
                Stop juggling dozens of bookmarked tabs and scattered tutorials. Access curated <strong>AWS production architectures</strong>, <strong>battle-tested GitHub IaC templates</strong>, <strong>video deep-dives</strong>, and <strong>direct talent network hiring emails</strong> — completely free.
              </p>
            </StaggerItem>

            <StaggerItem className="mt-8 flex flex-wrap items-center gap-4">
              <div className="relative inline-flex group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/30 rounded-xl">
                {/* Outer animated spark wrapper */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className={`absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] ${
                    isLight
                      ? "bg-[conic-gradient(from_90deg_at_50%_50%,#e0e7ff_0%,#c084fc_50%,#7c3aed_80%,#e0e7ff_100%)] opacity-80"
                      : "bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90"
                  }`} />
                </div>
                {/* Inner Button */}
                <button
                  onClick={() => handleBrowseLibrary()}
                  className={`relative m-[2px] flex items-center gap-2 rounded-[10px] px-6 py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer shadow-xl ${
                    isLight
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-500/25"
                      : "bg-gradient-to-r from-violet-900 to-fuchsia-900 hover:from-violet-800 hover:to-fuchsia-800"
                  }`}
                >
                  Browse Free Library <ArrowRight size={16} className="text-fuchsia-200" />
                </button>
              </div>

              <a
                href="#overview"
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isLight
                    ? "border-violet-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-slate-700 shadow-xs"
                    : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-slate-200"
                }`}
              >
                <Layers size={16} className={isLight ? "text-violet-600" : "text-fuchsia-400"} />
                See What's Inside
              </a>
            </StaggerItem>

            <StaggerItem>
              <div className={`mt-8 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm ${
                isLight ? "text-slate-600" : "text-slate-300"
              }`}>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Curated & Verified
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Free & Open Access
                </span>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* RIGHT WORKSPACE */}
          <div className="relative">
            <div className={`absolute -inset-10 rounded-full blur-3xl ${
              isLight ? "bg-gradient-to-r from-violet-400/20 to-fuchsia-400/15" : "bg-gradient-to-r from-violet-600 to-fuchsia-600/15"
            }`} />

            <div className="relative mx-auto w-full max-w-[420px]">
              <CloudTraffic />
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ================= CORE HIGHLIGHT PODS (SHIFTED TO DEDICATED SECTION) ================= */}
      <section className="relative z-10 -mt-6 md:-mt-10 mb-12 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: 100+ CURATED GUIDES */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleBrowseLibrary()}
            style={{
              clipPath: "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
            }}
            className={`group relative p-[1.5px] transition-all cursor-pointer ${
              isLight
                ? "bg-gradient-to-br from-fuchsia-300 via-violet-300 to-indigo-200 shadow-[0_10px_30px_rgba(139,92,246,0.12)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.2)]"
                : "bg-gradient-to-br from-fuchsia-500/60 via-violet-500/40 to-cyan-400/50 shadow-[0_0_35px_rgba(217,70,239,0.25)] hover:shadow-[0_0_50px_rgba(217,70,239,0.45)]"
            }`}
          >
            <div
              style={{
                clipPath: "polygon(17px 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%, 0 17px)",
              }}
              className={`p-6 md:p-7 backdrop-blur-2xl h-full flex flex-col justify-between ${
                isLight ? "bg-white" : "bg-[#070b14]/95"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Hexagonal Tech Node Icon */}
                  <div
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 p-[1.5px] shadow-lg"
                  >
                    <div
                      style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                      className={`flex h-full w-full items-center justify-center ${
                        isLight ? "bg-violet-50" : "bg-[#0d1326]"
                      }`}
                    >
                      <BookOpen size={24} className="text-fuchsia-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                        100+ Curated Guides
                      </h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        isLight
                          ? "bg-violet-50 text-violet-700 border-violet-200"
                          : "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40"
                      }`}>
                        FREE
                      </span>
                    </div>
                    <p className={`text-xs font-mono mt-0.5 ${isLight ? "text-violet-600" : "text-fuchsia-300/80"}`}>
                      COLLECTION // BATTLE-TESTED SRE DOCS
                    </p>
                  </div>
                </div>

                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                  isLight
                    ? "bg-violet-50 text-violet-600 group-hover:bg-violet-100 border-violet-200"
                    : "bg-white/[0.04] text-white/50 group-hover:text-fuchsia-400 group-hover:bg-fuchsia-500/10 border-white/10"
                }`}>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <p className={`mt-4 text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Step-by-step production runbooks from Kubernetes cluster hardening to Terraform AWS infrastructure patterns — curated by senior platform engineers.
              </p>

              <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
                isLight ? "border-slate-100 text-slate-500" : "border-white/10 text-slate-400"
              }`}>
                <span className="flex items-center gap-1.5 text-emerald-500 font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Instant Free Access
                </span>
                <span className={`font-semibold group-hover:underline flex items-center gap-1 ${
                  isLight ? "text-violet-600" : "text-fuchsia-400"
                }`}>
                  Explore Library <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: REAL-WORLD ARCHITECTURES */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              const el = document.getElementById('architecture');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              clipPath: "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
            }}
            className={`group relative p-[1.5px] transition-all cursor-pointer ${
              isLight
                ? "bg-gradient-to-br from-cyan-300 via-blue-300 to-indigo-300 shadow-[0_10px_30px_rgba(14,165,233,0.12)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.2)]"
                : "bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/50 shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.45)]"
            }`}
          >
            <div
              style={{
                clipPath: "polygon(17px 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%, 0 17px)",
              }}
              className={`p-6 md:p-7 backdrop-blur-2xl h-full flex flex-col justify-between ${
                isLight ? "bg-white" : "bg-[#070b14]/95"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Hexagonal Tech Node Icon */}
                  <div
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg"
                  >
                    <div
                      style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                      className={`flex h-full w-full items-center justify-center ${
                        isLight ? "bg-cyan-50" : "bg-[#0d1326]"
                      }`}
                    >
                      <Server size={24} className="text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl md:text-2xl font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                        Real-world Architectures
                      </h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        isLight
                          ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                          : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      }`}>
                        LIVE
                      </span>
                    </div>
                    <p className={`text-xs font-mono mt-0.5 ${isLight ? "text-cyan-600" : "text-cyan-300/80"}`}>
                      TOPOLOGY // MULTI-AZ CLOUD DESIGNS
                    </p>
                  </div>
                </div>

                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                  isLight
                    ? "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100 border-cyan-200"
                    : "bg-white/[0.04] text-white/50 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 border-white/10"
                }`}>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <p className={`mt-4 text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Interactive production topologies for AWS multi-AZ VPCs, Application Load Balancers, container auto-scaling clusters, and automated failover systems.
              </p>

              <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
                isLight ? "border-slate-100 text-slate-500" : "border-white/10 text-slate-400"
              }`}>
                <span className="flex items-center gap-1.5 text-cyan-500 font-mono">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                  Interactive Simulator
                </span>
                <span className={`font-semibold group-hover:underline flex items-center gap-1 ${
                  isLight ? "text-cyan-600" : "text-cyan-400"
                }`}>
                  View Architecture <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= 30-SECOND OVERVIEW: WHAT IS THIS WEBSITE? ================= */}
      <section id="overview" className={`border-t border-b py-16 scroll-mt-20 transition-colors ${
        isLight ? "border-violet-100 bg-[#FBFBFE]" : "border-white/10 bg-[#070b14]"
      }`}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border ${
                isLight
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400"
              }`}>
                <Sparkles className="w-3.5 h-3.5" /> What Is Inside DevOps Store?
              </div>
              <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Everything in One Unified Feed
              </h2>
              <p className={`mt-2 text-sm md:text-base max-w-2xl ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Not an e-commerce shop. We are a free, community-powered engineering archive curated with real-world infrastructure assets:
              </p>
            </div>

            <button
              onClick={() => handleBrowseLibrary()}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-fit cursor-pointer border ${
                isLight
                  ? "bg-white hover:bg-violet-50 text-slate-800 border-violet-200 shadow-xs hover:border-violet-300"
                  : "bg-white/[0.06] hover:bg-white/[0.1] text-white border-white/10"
              }`}
            >
              Open Live Resource Desk <ArrowRight className={`w-4 h-4 ${isLight ? "text-violet-600" : "text-fuchsia-400"}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Cloud Architecture */}
            <div
              onClick={() => {
                document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-orange-200/80 shadow-xs hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10"
                  : "border-orange-500/20 bg-gradient-to-b from-orange-500/5 to-transparent hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                }`}>
                  <Cloud className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isLight ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-orange-500/10 text-orange-300 border-orange-500/20"
                }`}>
                  Live Topologies
                </span>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-orange-600" : "text-white group-hover:text-orange-300"
              }`}>
                AWS & Cloud Architectures
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Interactive topologies showing Route 53, ALB, EC2, RDS, and ElastiCache pipelines with step-by-step traffic packet flows.
              </p>
            </div>

            {/* Card 2: GitHub IaC */}
            <div
              onClick={() => handleBrowseLibrary('git')}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-violet-200/80 shadow-xs hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10"
                  : "border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                }`}>
                  <Github className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isLight ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                }`}>
                  Ready-to-Deploy
                </span>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-violet-600" : "text-white group-hover:text-purple-300"
              }`}>
                GitHub IaC & Repositories
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Production-grade Terraform modules, Docker compose files, Kubernetes manifests, and CI/CD pipelines ready to clone.
              </p>
            </div>

            {/* Card 3: Video Tutorials & Playlists */}
            <div
              onClick={() => handleBrowseLibrary('ypl')}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-red-200/80 shadow-xs hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10"
                  : "border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-red-50 text-red-600 border-red-200" : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  <Youtube className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseLibrary('ypl');
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                      isLight ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" : "bg-red-500/20 text-red-200 border-red-500/30 hover:bg-red-500/30"
                    }`}
                  >
                    Playlists
                  </span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseLibrary('yt');
                    }}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer ${
                      isLight ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    Videos
                  </span>
                </div>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-red-600" : "text-white group-hover:text-red-300"
              }`}>
                YouTube Playlists & Guides
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Handpicked course playlists and video breakdowns covering system design, cloud failure scenarios, debugging sessions, and Kubernetes tips.
              </p>
            </div>

            {/* Card 4: Recruiter Emails */}
            <div
              onClick={() => handleBrowseLibrary('email')}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-fuchsia-200/80 shadow-xs hover:border-fuchsia-400 hover:shadow-lg hover:shadow-fuchsia-500/10"
                  : "border-fuchsia-500/20 bg-gradient-to-b from-fuchsia-500/5 to-transparent hover:border-fuchsia-500/40 hover:shadow-[0_8px_30px_rgba(217,70,239,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200" : "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400"
                }`}>
                  <Mail className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isLight ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" : "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20"
                }`}>
                  Direct Hiring Contacts
                </span>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-fuchsia-600" : "text-white group-hover:text-fuchsia-300"
              }`}>
                Company Talent Directory
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Verified recruiter emails and talent network access points from tech companies actively hiring DevOps & SRE talent.
              </p>
            </div>

            {/* Card 5: Technical Blogs */}
            <div
              onClick={() => handleBrowseLibrary('blog')}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-cyan-200/80 shadow-xs hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10"
                  : "border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-cyan-50 text-cyan-600 border-cyan-200" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isLight ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                }`}>
                  Architecture Case Studies
                </span>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-cyan-600" : "text-white group-hover:text-cyan-300"
              }`}>
                In-Depth Technical Blogs
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Real-world outage retrospectives, scaling blueprints, zero-trust network configurations, and observability guides.
              </p>
            </div>

            {/* Card 6: Interactive Cheatsheets */}
            <div
              onClick={() => handleBrowseLibrary('lab')}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-emerald-200/80 shadow-xs hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10"
                  : "border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  <Code2 className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isLight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                }`}>
                  Quick Reference
                </span>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-emerald-600" : "text-white group-hover:text-emerald-300"
              }`}>
                Linux & System Cheatsheets
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Copy-pasteable one-liners, kubectl commands, Docker network setups, and system diagnostic commands for high-pressure incident response.
              </p>
            </div>

            {/* Card 7: Threads Visual Guides & Architecture Carousels */}
            <div
              onClick={() => handleBrowseLibrary('th')}
              className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                isLight
                  ? "bg-white border-purple-200/80 shadow-xs hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10"
                  : "border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isLight ? "bg-purple-50 text-purple-600 border-purple-200" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                } font-bold text-lg`}>
                  @
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isLight ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                }`}>
                  Visual Carousels
                </span>
              </div>
              <h3 className={`text-lg font-bold transition-colors ${
                isLight ? "text-slate-900 group-hover:text-purple-600" : "text-white group-hover:text-purple-300"
              }`}>
                Threads Architecture Posts
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Multi-slide visual blueprints, Kubernetes topology infographics, real incident postmortems, and cloud engineering tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KUBERNETES ANIMATION ================= */}
      <section className={`border-t py-24 transition-colors ${
        isLight ? "border-violet-100 bg-white" : "border-white/10 bg-[#04060e]"
      }`}>
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              Scale with <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>Confidence</span>
            </h2>
            <p className={`text-lg leading-relaxed ${isLight ? "text-slate-600" : "text-slate-200"}`}>
              Master Kubernetes orchestration. Watch as your pods automatically scale across healthy nodes, ensuring high availability and robust performance for your applications. Learn the essential strategies for resilient infrastructure.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className={`w-full max-w-[420px] rounded-2xl ${isLight ? "shadow-2xl ring-1 ring-violet-200/60" : ""}`}>
              <K8sPods />
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ================= AWS CLOUD TOPOLOGY & ARCHITECTURE ================= */}
      <section id="architecture" className={`border-t py-24 overflow-hidden scroll-mt-16 transition-colors ${
        isLight ? "border-violet-100 bg-[#FAF9FE]" : "border-white/10 bg-[#0a060f]"
      }`}>
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 flex flex-col gap-12">
          <div className="text-center relative z-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border ${
              isLight ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-orange-500/10 border-orange-500/30 text-orange-400"
            }`}>
              <AwsLogo className="w-5 h-3.5" /> High-Availability Infrastructure
            </div>
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">AWS Architecture</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isLight ? "text-slate-600" : "text-slate-200"}`}>
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
      <section className={`mx-auto max-w-7xl px-6 py-20 relative z-10 border-t ${
        isLight ? "border-violet-100" : "border-white/10"
      }`}>
        <FadeIn>
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            Explore Our <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>Deep Catalogs</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isLight ? "text-slate-600" : "text-slate-200"}`}>
            Everything you need to level up your engineering career. From technical tutorials to exclusive company insights, all curated in one central hub.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem className="md:col-span-2">{/* Main Feature: Career Emails */}
          <div className={`relative h-full group rounded-2xl border p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
            isLight
              ? "border-orange-200/80 bg-gradient-to-br from-orange-50/40 via-amber-50/20 to-white shadow-xs hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10"
              : "border-orange-500/30 bg-gradient-to-br from-[#16110f] to-[#0a0808] hover:border-orange-500/60 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]"
          }`}>
            <div className={`absolute top-0 right-0 p-6 transition-opacity ${
              isLight ? "opacity-10 group-hover:opacity-15 text-orange-400" : "opacity-10 group-hover:opacity-20 text-fuchsia-400"
            }`}>
              <Mail className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
                isLight ? "bg-orange-100/80 text-orange-600 border-orange-200" : "bg-fuchsia-500/10 text-fuchsia-400 border-transparent"
              }`}>
                <Mail className="w-6 h-6" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Company Career Emails</h3>
              <p className={`max-w-md mb-8 ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Get an inside look at how top engineering teams operate. Real insights, culture breakdowns, and direct access to talent network opportunities.
              </p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  isLight ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-fuchsia-500/10 text-fuchsia-400 border-orange-500/20"
                }`}>
                  47+ Archives
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  isLight ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-white/[0.03] text-slate-100 border-white/10"
                }`}>
                  Updated Weekly
                </span>
              </div>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Secondary: GitHub */}
          <div className={`relative group rounded-2xl border p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
            isLight
              ? "border-slate-200 bg-white shadow-xs hover:border-violet-300 hover:shadow-xl"
              : "border-white/10 bg-[#0d1117] hover:border-white/30 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]"
          }`}>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
                isLight ? "bg-slate-100 text-slate-800 border-slate-200" : "bg-white/[0.03] text-slate-100 border-white/10"
              }`}>
                <Github className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>GitHub Repos</h3>
              <p className={`mb-6 text-sm ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Production-ready templates, IaC modules, and curated open-source tools.
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                isLight ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-white/[0.03] text-slate-100 border-white/10"
              }`}>
                11 Repositories
              </span>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: YouTube & Playlists */}
          <div 
            onClick={() => handleBrowseLibrary('ypl')}
            className={`relative group rounded-2xl border p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              isLight
                ? "border-red-200/80 bg-white shadow-xs hover:border-red-400 hover:shadow-xl"
                : "border-red-500/20 bg-gradient-to-br from-[#1a0f0f] to-[#0a0505] hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)]"
            }`}
          >
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
                isLight ? "bg-red-50 text-red-600 border-red-200" : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                <Youtube className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Video Playlists & Tutorials</h3>
              <p className={`mb-6 text-sm ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Deep-dive architectural breakdowns, complete courses, and hands-on deployment playlists.
              </p>
              <div className="flex gap-2">
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseLibrary('ypl');
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                    isLight ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" : "bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30"
                  }`}
                >
                  Playlists
                </span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseLibrary('yt');
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                    isLight ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" : "bg-white/[0.03] text-slate-100 border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  Videos
                </span>
              </div>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: Technical Blogs */}
          <div className={`relative group rounded-2xl border p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
            isLight
              ? "border-cyan-200/80 bg-white shadow-xs hover:border-cyan-400 hover:shadow-xl"
              : "border-cyan-500/20 bg-gradient-to-br from-[#0f171a] to-[#05080a] hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)]"
          }`}>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
                isLight ? "bg-cyan-50 text-cyan-600 border-cyan-200" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
              }`}>
                <FileText className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Technical Blogs</h3>
              <p className={`mb-6 text-sm ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                System design concepts, post-mortems, and engineering best practices.
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                isLight ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
              }`}>
                37 Articles
              </span>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: LinkedIn */}
          <div className={`relative group rounded-2xl border p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
            isLight
              ? "border-blue-200/80 bg-white shadow-xs hover:border-blue-400 hover:shadow-xl"
              : "border-blue-500/20 bg-gradient-to-br from-[#0f141a] to-[#05080a] hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]"
          }`}>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
                isLight ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                <Linkedin className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Network Posts</h3>
              <p className={`mb-6 text-sm ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Bite-sized industry updates, career advice, and community discussions.
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                isLight ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
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
      <section id="learn" className={`mx-auto max-w-7xl px-6 py-24 transition-colors`}>
        <FadeIn>
        <div className="mb-14 text-center">
          <h2 className={`text-4xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
            Why{" "}
            <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>
              DevOps Store?
            </span>
          </h2>

          <p className={`mt-4 ${isLight ? "text-slate-600" : "text-slate-200"}`}>
            Everything you need to learn, build, and grow in your DevOps
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          
          {/* Box 1 (Large - 2x2) */}
          <div className={`group md:col-span-2 md:row-span-2 rounded-3xl border p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-end ${
            isLight
              ? "border-violet-100 bg-white shadow-sm hover:border-violet-300 hover:shadow-xl"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}>
            <div className={`absolute top-0 right-0 p-8 transition-colors duration-500 ${
              isLight ? "text-violet-500/10 group-hover:text-violet-500/20" : "text-fuchsia-500/20 group-hover:text-fuchsia-500/40"
            }`}>
              <Container size={120} strokeWidth={1} />
            </div>
            <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-t from-white via-white/40 to-transparent" : "bg-gradient-to-t from-black/80 via-black/20 to-transparent"}`} />
            <div className="relative z-10">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${
                isLight ? "bg-violet-100 text-violet-600" : "bg-fuchsia-500/20 text-fuchsia-400"
              }`}>
                <BookOpen size={24} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Build Your Toolkit</h3>
              <p className={`max-w-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Save tutorials, blogs, GitHub repositories, commands, and useful links in one organized place. Stop losing track of that one perfect guide you found.
              </p>
            </div>
          </div>

          {/* Box 2 (1x1) */}
          <div className={`group md:col-span-1 rounded-3xl border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 flex flex-col justify-between ${
            isLight
              ? "border-violet-100 bg-gradient-to-br from-violet-50 to-white shadow-xs hover:border-violet-300 hover:shadow-lg"
              : "border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent hover:border-fuchsia-500/30"
          }`}>
            <div className={`inline-flex rounded-xl p-3 w-fit ${
              isLight ? "bg-violet-100 text-violet-600" : "bg-violet-500/20 text-violet-400"
            }`}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-1 ${isLight ? "text-slate-900" : "text-white"}`}>Curated by Experts</h3>
              <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Carefully selected tutorials and resources to accelerate your growth.
              </p>
            </div>
          </div>

          {/* Box 3 (1x1) */}
          <div className={`group lg:col-span-1 md:col-span-2 rounded-3xl border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 flex flex-col justify-between ${
            isLight
              ? "border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-xs hover:border-blue-300 hover:shadow-lg"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}>
            <div className={`inline-flex rounded-xl p-3 w-fit ${
              isLight ? "bg-blue-100 text-blue-600" : "bg-blue-500/20 text-blue-400"
            }`}>
              <Code2 size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-1 ${isLight ? "text-slate-900" : "text-white"}`}>Tools & Templates</h3>
              <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-200"}`}>
                Collect snippets, and architectures for real-world production use.
              </p>
            </div>
          </div>

          {/* Box 4 (Wide - 2x1) */}
          <div className={`group md:col-span-2 rounded-3xl border p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-center ${
            isLight
              ? "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-xs hover:border-emerald-300 hover:shadow-lg"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}>
             <div className={`absolute -right-10 top-1/2 -translate-y-1/2 transition-colors duration-500 ${
               isLight ? "text-emerald-500/10 group-hover:text-emerald-500/15" : "text-emerald-500/10 group-hover:text-emerald-500/20"
             }`}>
              <Network size={160} strokeWidth={1} />
            </div>
            <div className="relative z-10 max-w-sm">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${
                isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                <Users size={24} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Grow Together</h3>
              <p className={isLight ? "text-slate-600" : "text-slate-200"}>
                Share useful knowledge, help others, and grow together as a DevOps community.
              </p>
            </div>
          </div>

        </div>
        </FadeIn>
      </section>

      {/* ================= TERMINAL ANIMATION ================= */}
      <section className={`border-t py-24 transition-colors ${
        isLight ? "border-violet-100 bg-[#FBFBFE]" : "border-white/10 bg-[#04060e]"
      }`}>
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className={`w-full max-w-[420px] rounded-2xl ${isLight ? "shadow-2xl ring-1 ring-violet-200/60" : ""}`}>
              <Terminal />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              Master the <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>Terminal</span>
            </h2>
            <p className={`text-lg leading-relaxed ${isLight ? "text-slate-600" : "text-slate-200"}`}>
              Get comfortable with the command line. Learn essential Linux commands, bash scripting, and log analysis to troubleshoot and optimize your systems effectively without leaving the keyboard.
            </p>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ================= DOMAINS ================= */}
      <section id="domains" className={`mx-auto max-w-7xl px-6 py-20 transition-colors`}>
        <FadeIn>
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className={`mb-2 text-sm uppercase tracking-[0.25em] font-semibold ${
              isLight ? "text-violet-600" : "text-fuchsia-400"
            }`}>
              Explore
            </p>

            <h2 className={`text-4xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              DevOps <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>Domains</span>
            </h2>
          </div>

          <button
            onClick={() => handleBrowseLibrary()}
            className={`flex items-center gap-2 font-semibold transition-colors cursor-pointer ${
              isLight ? "text-violet-600 hover:text-violet-800" : "text-fuchsia-400 hover:text-orange-300"
            }`}
          >
            View all resources <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {domains.map((domain) => (
            <button
              key={domain.name}
              onClick={() => handleBrowseLibrary('lab')}
              className={`group flex items-center justify-between rounded-xl border p-5 text-left transition hover:-translate-y-1 cursor-pointer ${
                isLight
                  ? "border-slate-200 bg-white shadow-xs hover:border-violet-300 hover:shadow-md text-slate-800"
                  : `border-white/10 bg-gradient-to-br ${domain.color} hover:border-white/25 text-white`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{domain.icon}</span>
                <span className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>{domain.name}</span>
              </div>

              <ArrowRight
                size={17}
                className={`transition group-hover:translate-x-1 ${
                  isLight ? "text-slate-400 group-hover:text-violet-600" : "text-slate-200 group-hover:text-fuchsia-400"
                }`}
              />
            </button>
          ))}
        </div>
        </FadeIn>
      </section>

      {/* ================= PIPELINE ANIMATION ================= */}
      <section className={`border-t py-24 transition-colors ${
        isLight ? "border-violet-100 bg-white" : "border-white/10 bg-[#04060e]"
      }`}>
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              Automate your <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>Pipelines</span>
            </h2>
            <p className={`text-lg leading-relaxed ${isLight ? "text-slate-600" : "text-slate-200"}`}>
              Streamline your development lifecycle. Build, test, and deploy faster with robust CI/CD pipelines that catch errors early and ship code securely to production.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className={`w-full max-w-[420px] rounded-2xl ${isLight ? "shadow-2xl ring-1 ring-violet-200/60" : ""}`}>
              <Pipeline />
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ================= SHARE ================= */}
      <section id="resources" className="mx-auto max-w-7xl px-6 py-20">
        <FadeIn>
        <div className={`relative overflow-hidden rounded-3xl border p-8 md:p-14 transition-all ${
          isLight
            ? "border-violet-200/80 bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 text-white shadow-2xl shadow-violet-600/20"
            : "border-white/10 bg-gradient-to-r from-[#17103a] via-[#1a0a22] to-[#31102f] text-white"
        }`}>
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
                to <span className="text-fuchsia-300">Share?</span>
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-white/90">
                Found a helpful DevOps link, tutorial, article, tool, or have a
                question? Forward it and help make DevOps Store more useful for
                everyone.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur-md">
              <a
                href="https://forms.gle/9K951bFHCiGWfTMQA"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white text-violet-900 px-5 py-4 font-bold shadow-lg shadow-black/20 transition hover:bg-slate-100"
              >
                Click here
                <ArrowRight size={18} />
              </a>

              <p className="mt-5 text-sm text-white/80">
                Your contribution helps other DevOps learners discover valuable
                knowledge. ❤️
              </p>
            </div>
          </div>
        </div>
        </FadeIn>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className={`mx-auto max-w-7xl px-6 py-24 text-center transition-colors ${
        isLight ? "bg-white rounded-3xl border border-violet-100 my-8 shadow-sm" : ""
      }`}>
        <FadeIn>
          <h2 className={`text-3xl md:text-5xl font-bold mb-8 ${isLight ? "text-slate-900" : "text-white"}`}>
            Ready to explore the <span className={isLight ? "text-violet-600" : "text-fuchsia-400"}>DevOps Store?</span>
          </h2>
          <div className="flex justify-center">
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="relative inline-flex group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/30 rounded-xl">
                {/* Outer animated spark wrapper */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className={`absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] ${
                    isLight
                      ? "bg-[conic-gradient(from_90deg_at_50%_50%,#e0e7ff_0%,#c084fc_50%,#7c3aed_80%,#e0e7ff_100%)] opacity-80"
                      : "bg-[conic-gradient(from_90deg_at_50%_50%,#1e1b4b_0%,#1e1b4b_50%,#e879f9_80%,#ffffff_100%)] opacity-90"
                  }`} />
                </div>
                {/* Inner Button */}
                <button
                  onClick={() => handleBrowseLibrary()}
                  className={`relative m-[2px] flex items-center gap-2 rounded-[10px] px-7 py-4 font-semibold text-white transition-colors cursor-pointer shadow-xl ${
                    isLight
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-500/25"
                      : "bg-gradient-to-r from-violet-900 to-fuchsia-900 hover:from-violet-800 hover:to-fuchsia-800"
                  }`}
                >
                  Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-fuchsia-200" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="about" className={`border-t transition-colors ${
        isLight ? "border-slate-200 bg-[#090D1A] text-slate-300" : "border-white/10 bg-[#060816] text-slate-200"
      }`}>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <LogoIcon size={32} />
              <h3 className="text-xl font-bold tracking-tight text-white">
                DevOps <span className="text-fuchsia-400">Store</span>
              </h3>
            </div>

            <p className="mt-5 leading-7 text-slate-300">
              Connect with me on these platforms
            </p>

            <div className="mt-6 flex gap-3">
              <a href="https://www.linkedin.com/in/mahidhara-kailash-850611144/" target="_blank" rel="noreferrer" title="LinkedIn Profile" aria-label="LinkedIn Profile" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/[0.05] overflow-hidden transition-colors">
                <img src="/linkedin-app-icon.webp" alt="LinkedIn" className="w-6 h-6 object-cover" />
              </a>
              <a href="https://www.instagram.com/devops_learnings/" target="_blank" rel="noreferrer" title="Instagram Profile" aria-label="Instagram Profile" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/[0.05] overflow-hidden transition-colors">
                <Instagram className="w-5 h-5 text-pink-400" />
              </a>
              <a href="mailto:suryakailash.mahidhara@gmail.com" title="Email Suryakailash" aria-label="Email Suryakailash" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/[0.05] transition-colors text-slate-300 hover:text-white">
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
            <h4 className="font-bold text-white">Stay Updated</h4>

            <p className="mt-4 text-sm leading-6 text-slate-300">
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
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400 text-white"
                />

                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 transition hover:from-violet-500 hover:to-fuchsia-500 cursor-pointer text-white"
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

        <div className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
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
      <h4 className="font-bold text-white">{title}</h4>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={link.onClick}
            className="text-left text-sm text-slate-300 transition hover:text-fuchsia-400 cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
