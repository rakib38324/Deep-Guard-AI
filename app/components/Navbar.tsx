"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Zap, Menu, X } from "lucide-react";

interface NavbarProps {
  demoMode: boolean;
}

export default function Navbar({ demoMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/50 backdrop-blur-lg shadow-lg shadow-indigo-950/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center glow-accent transition-all group-hover:scale-110">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight">
            Deep<span className="text-indigo-400">Guard</span>
            <span className="text-xs font-mono text-cyan-400 ml-1.5 align-middle">AI</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#analyze">Analyze</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="#stats">Research</NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {demoMode && (
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Zap className="w-3 h-3" />
              Demo Mode
            </span>
          )}
          <a
            href="#analyze"
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-200 glow-accent hover:scale-105"
          >
            Analyze Now
          </a>
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-bright border-t border-indigo-500/10 px-4 py-4 flex flex-col gap-4">
          <MobileLink href="#analyze" onClick={() => setMobileOpen(false)}>Analyze</MobileLink>
          <MobileLink href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</MobileLink>
          <MobileLink href="#stats" onClick={() => setMobileOpen(false)}>Research</MobileLink>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm text-slate-400 hover:text-white transition-colors duration-200 relative group"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-400 group-hover:w-full transition-all duration-300" />
    </a>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-slate-300 hover:text-white text-base py-1 border-b border-indigo-500/10"
    >
      {children}
    </a>
  );
}
