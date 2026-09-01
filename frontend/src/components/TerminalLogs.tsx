"use client";

import React, { useRef, useEffect } from "react";
import { Terminal, Shield, Sparkles, Filter, Database, Radio, Cpu, Layers } from "lucide-react";
import { TelemetryLogData } from "@/hooks/useSSEStream";
import { getLogLevelColor, cn } from "@/lib/utils";

interface TerminalLogsProps {
  logs: TelemetryLogData[];
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Fallback logs
  const displayLogs =
    logs.length > 0
      ? logs
      : [
          {
            timestamp: new Date().toISOString(),
            level: "INFO" as const,
            source: "MCP:FastMCP",
            message: "FastMCP Model Context Protocol spec 2025-11-25 initialized on Streamable HTTP channel.",
          },
          {
            timestamp: new Date().toISOString(),
            level: "INFO" as const,
            source: "SovereignMesh",
            message: "Multi-cloud Anycast route established: AWS us-east-1 (Active), GCP us-central1 (Standby).",
          },
          {
            timestamp: new Date().toISOString(),
            level: "INFO" as const,
            source: "ImmuneSystem",
            message: "Cloud Antibodies active: ANTIBODY-01, ANTIBODY-02, ANTIBODY-03 enforced in eBPF kernel.",
          },
          {
            timestamp: new Date().toISOString(),
            level: "AGENT" as const,
            source: "BedrockAgent",
            message: "AWS Bedrock Claude 3.5 Sonnet SRE supervisor standing by in production-aws-east.",
          },
        ];

  return (
    <div className="h-[135px] bg-[#0B101B]/85 backdrop-blur-2xl border border-cyan-500/15 rounded-2xl p-2.5 flex flex-col justify-between font-mono text-xs relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      
      {/* Console Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-cyan-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-100 font-serif">
              Live SRE Telemetry &amp; Adversarial Event Stream
            </span>
          </div>
          <span className="text-[9px] text-slate-400 hidden sm:inline">
            • Streamable HTTP SSE (2025-11-25)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[9px] text-slate-400">
          <span className="flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 text-cyan-400" />
            <span>Buffer: {displayLogs.length} events</span>
          </span>
        </div>
      </div>

      {/* Log Output Stream */}
      <div className="flex-1 overflow-y-auto space-y-1 my-1 pr-1 font-mono text-[9.5px] leading-relaxed custom-cyan-scrollbar">
        {displayLogs.map((log, index) => {
          const isError = log.level === "ERROR" || log.level === "CRITICAL";
          const isAgent = log.level === "AGENT";

          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 py-0.5 px-1.5 rounded transition-colors",
                isError ? "bg-rose-950/20 text-rose-200 border-l-2 border-rose-500" : "",
                isAgent ? "bg-cyan-950/20 text-cyan-100 border-l-2 border-cyan-400" : "hover:bg-cyan-950/10 text-slate-300"
              )}
            >
              <span className="text-slate-500 select-none text-[8.5px] shrink-0 font-sans">
                {log.timestamp.substring(11, 19)}
              </span>

              <span
                className={cn(
                  "px-1 py-0.2 rounded text-[7.5px] font-bold uppercase shrink-0",
                  log.level === "CRITICAL" || log.level === "ERROR"
                    ? "bg-rose-500/20 text-rose-300"
                    : log.level === "AGENT"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {log.level}
              </span>

              <span className="text-cyan-300/80 font-bold shrink-0">
                [{log.source}]
              </span>

              <span className="flex-1 break-words font-sans">{log.message}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

    </div>
  );
};
