import { PipelineAnimation } from "./PipelineAnimation";
import React, { useState } from 'react';
import { motion } from "motion/react";
import { LogoIcon } from './LogoIcon';
import { K8sPods, Terminal, Pipeline, CloudTraffic } from './DevOpsAnimations';
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
  FileText
} from "lucide-react";

const domains = [
  {
    name: "Kubernetes",
    icon: "☸",
    color: "from-blue-600/30 to-cyan-500/10",
  },
  {
    name: "Terraform",
    icon: "◆",
    color: "from-purple-600/30 to-violet-500/10",
  },
  {
    name: "AWS",
    icon: "aws",
    color: "from-orange-500/30 to-yellow-500/10",
  },
  {
    name: "CI/CD",
    icon: "∞",
    color: "from-emerald-500/30 to-teal-500/10",
  },
  {
    name: "Docker",
    icon: "🐳",
    color: "from-sky-500/30 to-blue-500/10",
  },
  {
    name: "GitHub Actions",
    icon: "◉",
    color: "from-indigo-500/30 to-purple-500/10",
  },
  {
    name: "Monitoring",
    icon: "▥",
    color: "from-pink-500/30 to-rose-500/10",
  },
  {
    name: "SRE",
    icon: "⬡",
    color: "from-orange-500/30 to-red-500/10",
  },
  {
    name: "Cloud",
    icon: "☁",
    color: "from-blue-500/30 to-indigo-500/10",
  },
  {
    name: "Linux",
    icon: "🐧",
    color: "from-yellow-500/30 to-orange-500/10",
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
    color: "from-orange-500/20 to-amber-500/5",
    iconColor: "text-orange-400",
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

export default function LandingPage({ setView }: { setView: (v: string) => void }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#0B0F19] to-[#050810]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-3">
            <LogoIcon size={44} />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                DevOps <span className="text-orange-400">Store</span>
              </h1>
              <p className="text-xs text-slate-400">
                Learn. Save. Build. Share.
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#domains" className="hover:text-orange-400">
              Explore
            </a>
            <a href="#resources" className="hover:text-orange-400">
              Resources
            </a>
            <a href="#learn" className="hover:text-orange-400">
              Learn & Grow
            </a>
            <a href="#domains" className="hover:text-orange-400">
              DevOps Domains
            </a>
            <a href="#about" className="hover:text-orange-400">
              About
            </a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <button className="rounded-full border border-white/10 p-3 text-slate-300 hover:bg-white/5">
              <Sun size={18} />
            </button>

            <button
              onClick={() => setView('feed')}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold transition hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/30"
            >
              Explore Desk <ArrowRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </nav>

        {mobileMenu && (
          <div className="border-t border-white/10 bg-[#0d1128] px-6 py-6 md:hidden">
            <div className="flex flex-col gap-5 text-slate-300">
              <a href="#domains" onClick={() => setMobileMenu(false)}>Explore</a>
              <a href="#resources" onClick={() => setMobileMenu(false)}>Resources</a>
              <a href="#learn" onClick={() => setMobileMenu(false)}>Learn & Grow</a>
              <a href="#domains" onClick={() => setMobileMenu(false)}>DevOps Domains</a>
              <a href="#about" onClick={() => setMobileMenu(false)}>About</a>
              <button
                onClick={() => setView('feed')}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
              >
                Explore Desk <ArrowRight size={16} />
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
            <StaggerItem className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
              <BookOpen size={16} />
              The All-In-One DevOps Hub
            </StaggerItem>

            <StaggerItem className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              DevOps Store
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 bg-clip-text text-transparent text-3xl md:text-5xl mt-4 block leading-snug">
                Tired of learning DevOps from different places?
              </span>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                We've centralized the best tutorials, GitHub repositories, tools, and cloud architecture guides. Stop searching and start building real-world infrastructure today.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={() => setView('feed')}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 group hover:-translate-y-1 hover:bg-orange-400"
                >
                  Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-10 flex flex-wrap gap-5 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-400" />
                  Expert-Curated
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-teal-400" />
                  Community-Driven
                </span>
                <span className="flex items-center gap-2">
                  <Server size={16} className="text-purple-400" />
                  Always Updated
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={16} className="text-green-400" />
                  Reliable
                </span>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* RIGHT WORKSPACE */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-orange-500/15 blur-3xl" />

            <div className="relative">
              <CloudTraffic />
            </div>
          </div>
        </div>
              </FadeIn>
      </section>

      {/* ================= KUBERNETES ANIMATION ================= */}
      <section className="border-t border-white/5 bg-[#04060e] py-24">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scale with <span className="text-orange-400">Confidence</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
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


      {/* ================= PIPELINE ANIMATION ================= */}
      <section className="border-t border-white/5 bg-[#0a060f] py-24 overflow-hidden">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 flex flex-col gap-12">
          <div className="text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AWS <span className="text-orange-400">Cloud Architecture</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Watch real-time traffic flow through a robust, highly-available AWS architecture. From edge networking to private compute and managed databases.
            </p>
          </div>
          <div className="w-full flex justify-center mt-4">
            <PipelineAnimation />
          </div>
        </div>
              </FadeIn>
      </section>

      {/* ================= EXPLORE CATALOGS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 relative z-10 border-t border-white/5">
        <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our <span className="text-orange-400">Deep Catalogs</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to level up your engineering career. From technical tutorials to exclusive company insights, all curated in one central hub.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem className="md:col-span-2">{/* Main Feature: Career Emails */}
          <div className="relative h-full group rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#16110f] to-[#0a0808] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mail className="w-48 h-48 text-orange-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Company Career Emails</h3>
              <p className="text-slate-400 max-w-md mb-8">
                Get an inside look at how top engineering teams operate. Real insights, culture breakdowns, and direct access to talent network opportunities.
              </p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium border border-orange-500/20">
                  47+ Archives
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-sm font-medium border border-white/10">
                  Updated Weekly
                </span>
              </div>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Secondary: GitHub */}
          <div className="relative group rounded-2xl border border-white/10 bg-[#0d1117] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Github className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">GitHub Repos</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Production-ready templates, IaC modules, and curated open-source tools.
              </p>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-sm font-medium border border-white/10">
                11 Repositories
              </span>
            </div>
          </div>

          </StaggerItem>
          <StaggerItem>{/* Tertiary: YouTube */}
          <div className="relative group rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#1a0f0f] to-[#0a0505] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <Youtube className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Video Tutorials</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Deep-dive architectural breakdowns and hands-on deployment guides.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20">
                  24 Videos
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-sm font-medium border border-white/10">
                  2 Playlists
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
              <p className="text-slate-400 mb-6 text-sm">
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
              <p className="text-slate-400 mb-6 text-sm">
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
            onClick={() => window.location.href = '/hub'}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Access All Catalogs <ArrowRight className="w-5 h-5" />
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
            <span className="text-orange-400">
              DevOps Store?
            </span>
          </h2>

          <p className="mt-4 text-slate-400">
            Everything you need to learn, build, and grow in your DevOps
            journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${feature.color} p-7 transition duration-300 hover:-translate-y-2 hover:border-white/20`}
              >
                <div className="mb-6 inline-flex rounded-xl bg-black/20 p-4">
                  <Icon className={feature.iconColor} size={30} />
                </div>

                <h3 className="text-xl font-bold">{feature.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
              </FadeIn>
      </section>

      {/* ================= TERMINAL ANIMATION ================= */}
      <section className="border-t border-white/5 bg-[#04060e] py-24">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="w-full max-w-[420px]">
              <Terminal />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Master the <span className="text-orange-400">Terminal</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
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
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-orange-400">
              Explore
            </p>

            <h2 className="text-4xl font-bold">
              DevOps <span className="text-orange-400">Domains</span>
            </h2>
          </div>

          <button className="flex items-center gap-2 text-orange-400 hover:text-orange-300">
            View all domains <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {domains.map((domain) => (
            <button
              key={domain.name}
              className={`group flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-br ${domain.color} p-5 text-left transition hover:-translate-y-1 hover:border-white/25`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{domain.icon}</span>
                <span className="font-semibold">{domain.name}</span>
              </div>

              <ArrowRight
                size={17}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-400"
              />
            </button>
          ))}
        </div>
              </FadeIn>
      </section>

      {/* ================= PIPELINE ANIMATION ================= */}
      <section className="border-t border-white/5 bg-[#04060e] py-24">
        <FadeIn>
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Automate your <span className="text-orange-400">Pipelines</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
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
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950 via-purple-950 to-orange-900/80 p-8 md:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="mb-5 inline-flex rounded-2xl bg-orange-500/15 p-5">
                <Link className="text-orange-400" size={42} />
              </div>

              <h2 className="text-4xl font-bold leading-tight">
                Have Something Useful
                <br />
                to <span className="text-orange-400">Share?</span>
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-slate-300">
                Found a helpful DevOps link, tutorial, article, tool, or have a
                question? Forward it and help make DevOps Store more useful for
                everyone.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#090d20]/60 p-7 backdrop-blur">
              <a
                href="https://forms.gle/9K951bFHCiGWfTMQA"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
              >
                Click here
                <ArrowRight size={18} />
              </a>

              <p className="mt-5 text-sm text-slate-400">
                Your contribution helps other DevOps learners discover valuable
                knowledge. ❤️
              </p>
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
                DevOps <span className="text-orange-400">Store</span>
              </h3>
            </div>

            <p className="mt-5 leading-7 text-slate-400">
              Connect with me on these platforms
            </p>

            <div className="mt-6 flex gap-3">
              <a href="https://www.linkedin.com/in/mahidhara-kailash-850611144/" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/10 overflow-hidden">
                <img src="/linkedin-app-icon.webp" alt="LinkedIn" className="w-6 h-6 object-cover" />
              </a>
              <a href="https://www.instagram.com/devops_learnings/" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/10 overflow-hidden">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9CihumYmd0OvEXygNNMSwjDYeLl97Zmii0MJbQUVUOA&s" alt="Instagram" className="w-6 h-6 object-cover rounded-md" referrerPolicy="no-referrer" />
              </a>
              <a href="mailto:suryakailash.mahidhara@gmail.com" className="flex items-center justify-center rounded-full border border-white/10 w-10 h-10 hover:bg-white/10">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={["All Resources", "Guides", "Tutorials", "Tools", "Cheat Sheets"]}
          />

          <FooterColumn
            title="Learn & Grow"
            links={["Learning Paths", "Best Practices", "Hands-on Labs", "DevOps Roadmap"]}
          />

          <FooterColumn
            title="DevOps Domains"
            links={["Kubernetes", "Cloud", "CI/CD", "Infrastructure", "Observability"]}
          />

          <div>
            <h4 className="font-bold">Stay Updated</h4>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Get useful DevOps resources and updates in your inbox.
            </p>

            <div className="mt-5 flex rounded-xl border border-white/10 bg-white/5 p-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-500"
              />

              <button className="rounded-lg bg-orange-500 px-4 transition hover:bg-orange-400">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
          © 2026 DevOps Store. Built with{" "}
          <span className="text-orange-400">♥</span> for DevOps Learners.
        </div>
      </footer>
    </main>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-bold">{title}</h4>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm text-slate-400 transition hover:text-orange-400"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
