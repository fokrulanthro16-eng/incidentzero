"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
  Zap,
  Activity,
  Layers,
  Cpu,
  Database,
  Terminal,
  Volume2,
  Lock,
  ChevronRight,
  CheckCircle2,
  Globe,
  Play,
} from "lucide-react";
import { formatLatency, formatRPS, cn } from "@/lib/utils";

interface AestheticHeroProps {
  onEnterWarRoom: () => void;
  onTriggerScenario: (scenarioId: string) => void;
  clusterStats?: {
    totalRps: number;
    avgLatencyMs: number;
    globalErrorRatePct: number;
    activeConnections: number;
  };
}

export const AestheticHero: React.FC<AestheticHeroProps> = ({
  onEnterWarRoom,
  onTriggerScenario,
  clusterStats = {
    totalRps: 2480,
    avgLatencyMs: 8.2,
    globalErrorRatePct: 0.0,
    activeConnections: 185,
  },
}) => {
  const [mobileActiveTab, setMobileActiveTab] = useState<"triage" | "voice" | "dag">("triage");

  return (
    <div className="relative min-h-screen w-full bg-[#05070B] text-slate-100 flex flex-col items-center justify-start overflow-hidden font-sans">
      {/* 1. Fullscreen Scenic Alpine/Sky Background with Atmospheric Lighting */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-65 scale-105 transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 25%, rgba(0, 240, 255, 0.15), transparent 45%),
                            radial-gradient(circle at 80% 60%, rgba(139, 92, 246, 0.12), transparent 40%),
                            linear-gradient(to bottom, rgba(5, 7, 11, 0.3) 0%, rgba(5, 7, 11, 0.75) 60%, #05070B 100%),
                            url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2560&auto=format&fit=crop')`,
        }}
      />

      {/* Subtle Aurora Fog Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Top Header / Glass Navigation */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onEnterWarRoom}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white via-slate-200 to-slate-400 p-[1px] shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <div className="w-full h-full bg-[#0A0D14] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                IncidentZero<span className="text-cyan-400">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-medium rounded-full bg-white/10 text-slate-300 backdrop-blur-md border border-white/10">
                MCP 2025-11-25
              </span>
            </div>
          </div>
        </div>

        {/* Center Pill Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-full px-5 py-2 shadow-2xl">
          <a href="#overview" className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1 transition-colors">Platform</a>
          <a href="#topology" className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1 transition-colors">Zero-Downtime</a>
          <a href="#agents" className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1 transition-colors">AWS Bedrock</a>
          <a href="#mcp" className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1 transition-colors">Streamable HTTP</a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEnterWarRoom}
            className="px-5 py-2 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all transform active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center gap-2"
          >
            Launch War Room
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. Centered Floating Display Hero Frame */}
      <main className="relative z-20 w-full max-w-5xl mx-auto px-4 pt-12 pb-32 flex flex-col items-center text-center">
        {/* Social Proof Floating Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] shadow-xl mb-6 hover:bg-white/[0.12] transition-all cursor-default animate-fade-in">
          <div className="flex -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 border border-[#05070B] flex items-center justify-center text-[8px] font-bold text-black">A+</div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-400 to-rose-500 border border-[#05070B] flex items-center justify-center text-[8px] font-bold text-black">AWS</div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border border-[#05070B] flex items-center justify-center text-[8px] font-bold text-black">SRE</div>
          </div>
          <span className="text-[11px] font-medium text-slate-200">
            <strong className="text-white font-semibold">50,000+ Incidents Triaged</strong> • Live on Amazon Alexa+ Track
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </div>

        {/* Large Display Serif Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white max-w-4xl leading-[1.1] mb-6 drop-shadow-sm font-normal">
          Autonomous Cloud Reliability <br className="hidden sm:inline" />
          <span className="italic font-serif bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Expertly Engineered
          </span> For You.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300/85 max-w-2xl font-light leading-relaxed mb-8">
          Voice-first zero-downtime triage engine. AWS Bedrock Claude 3.5 Sonnet reasons over live cloud telemetry and dispatches Model Context Protocol mitigations in milliseconds.
        </p>

        {/* Dual Pill CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16 z-30">
          <button
            onClick={onEnterWarRoom}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all transform active:scale-95 shadow-[0_0_35px_rgba(255,255,255,0.35)] flex items-center justify-center gap-2.5"
          >
            <Play className="w-4 h-4 fill-black" />
            Enter SRE War Room Console
          </button>

          <button
            onClick={() => onTriggerScenario("SCENARIO_DB_POOL_EXHAUSTED")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-medium bg-white/[0.08] hover:bg-white/[0.14] text-white backdrop-blur-xl border border-white/[0.15] transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Simulate SEV-1 Outage
          </button>
        </div>

        {/* 4. Overlapping Mobile iPhone Mockup with Embedded Mini Console */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto z-20">
          {/* Glass Phone Bezel Outer Frame */}
          <div className="relative rounded-[50px] bg-gradient-to-b from-slate-700 via-slate-900 to-black p-[3.5px] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(0,240,255,0.15)] border border-white/20">
            {/* Inner Phone Chassis */}
            <div className="rounded-[46px] bg-[#0A0D14] overflow-hidden border-[4px] border-black text-left flex flex-col h-[580px] relative">
              
              {/* Dynamic Island Notch & Speaker */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 bg-black rounded-full px-4 py-1.5 flex items-center gap-3 shadow-md border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-300 font-bold tracking-wider">ALEXA+ SRE</span>
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              {/* Status Bar */}
              <div className="pt-3 px-7 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px]">5G</span>
                  <div className="w-4 h-2 rounded-sm border border-slate-400 p-[1px]">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Mini App Viewport Content */}
              <div className="flex-1 p-4 pt-8 overflow-y-auto flex flex-col gap-3 font-mono text-xs">
                
                {/* Active Incident Alert Capsule */}
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold uppercase border border-rose-500/40">
                      SEV-1 OUTAGE DETECTED
                    </span>
                    <span className="text-[10px] text-slate-400">T+00:18</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Postgres DB Pool Starvation</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">100/100 locked connections on Node-03.</p>
                </div>

                {/* Voice Activity Waveform Strip */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">Voice Triage Active</span>
                    </div>
                    <span className="text-[9px] text-emerald-400">Listening...</span>
                  </div>
                  {/* Waveform Bars */}
                  <div className="flex items-center justify-between h-7 px-1 gap-1">
                    {[12, 24, 18, 28, 14, 22, 32, 16, 26, 12, 20, 28, 15, 25, 10].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Microservice Health Pills */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">Gateway</span>
                    <span className="text-xs font-bold text-emerald-400">12ms • 0% err</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/40">
                    <span className="text-[9px] text-rose-400 block">Postgres DB</span>
                    <span className="text-xs font-bold text-rose-400">4,850ms • Lock</span>
                  </div>
                </div>

                {/* Bedrock Mitigation Action Card */}
                <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                  <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-bold mb-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>Bedrock Claude 3.5 Plan</span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Failover traffic to Zone-1b standby pool &amp; purge query locks.
                  </p>
                  <button
                    onClick={onEnterWarRoom}
                    className="w-full mt-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all"
                  >
                    Confirm &amp; Remediate
                  </button>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="pb-2 pt-1 flex justify-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Four-Column Apple/Stripe-Style Stat Metrics Bar */}
      <footer className="relative z-20 w-full border-t border-white/[0.08] bg-[#05070B]/90 backdrop-blur-2xl py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              99.99<span className="text-cyan-400">%</span>
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Autonomous SLA Compliance
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              &lt; 8<span className="text-slate-400 text-lg">ms</span>
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Average Cluster Latency
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400 tracking-tight">
              50,000<span className="text-slate-400 text-lg">+</span>
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Outages Resolved
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tracking-tight">
              0<span className="text-slate-400 text-lg">s</span>
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Zero-Downtime Failover
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
};
