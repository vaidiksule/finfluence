'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Home,
  Layers,
  Network,
  Cpu,
  Mail,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  onExploreGraph: () => void;
  onLaunchPlatform: () => void;
}

export default function Navbar({ onExploreGraph, onLaunchPlatform }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home', icon: Home },
    { label: 'Overview', href: '#overview', icon: Layers },
    { label: 'Impact Graph', href: '#impact-graph', icon: Network },
    { label: 'Capabilities', href: '#capabilities', icon: Cpu },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <header className="w-full pt-4 pb-2 px-4 md:px-8 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Left: Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition">
            <Image
              src="/logo-no-bg.png"
              alt="Finfluence"
              width={22}
              height={22}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
            Finfluence
            <span className="text-[10px] text-slate-400 font-normal">™</span>
          </span>
        </a>

        {/* Center: Minimal Floating Pill Menu (Dribbble Style) */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-[#0B111F]/80 px-3 py-1.5 backdrop-blur-xl shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                <Icon className="h-3 w-3 text-slate-400" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Clean White Pill CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onExploreGraph}
            className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#080C15] shadow-md hover:bg-slate-100 transition active:scale-95"
          >
            <span>Get Started Now</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden rounded-full border border-white/10 p-2 text-slate-300 hover:text-white transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0B111F] p-4 md:hidden shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onExploreGraph();
            }}
            className="mt-2 w-full rounded-full bg-white py-2 text-xs font-semibold text-[#080C15]"
          >
            Get Started Now
          </button>
        </div>
      )}
    </header>
  );
}
