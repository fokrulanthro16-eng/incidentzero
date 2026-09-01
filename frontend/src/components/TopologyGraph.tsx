"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Database,
  Globe,
  CreditCard,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Plus,
  Minus,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ServiceNodeData } from "@/hooks/useSSEStream";
import { getStatusColor, formatLatency, formatRPS, playChime, cn } from "@/lib/utils";

interface TopologyGraphProps {
  nodes?: Record<string, ServiceNodeData>;
  onIsolateNode?: (nodeId: string) => void;
  onScaleService?: (serviceName: string, targetCount: number) => void;
}

export const TopologyGraph: React.FC<TopologyGraphProps> = ({
  nodes = {},
  onIsolateNode,
  onScaleService,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("postgres-cluster-primary");

  // High-fidelity fallback topology
  const defaultNodes: Record<string, ServiceNodeData> = {
    "ingress-gw-01": {
      id: "ingress-gw-01",
      name: "API Ingress Gateway",
      role: "gateway",
      zone: "us-east-1a",
      host_node: "Node-01",
      status: "healthy",
      latency_ms: 12.4,
      error_rate_pct: 0.0,
      rps: 2480,
      cpu_pct: 34.0,
      memory_pct: 42.0,
      active_connections: 45,
      max_connections: 500,
      replica_count: 4,
      target_replicas: 4,
      is_isolated: false,
      upstream_ids: [],
      downstream_ids: ["auth-svc-cluster", "payment-svc-cluster"],
    },
    "auth-svc-cluster": {
      id: "auth-svc-cluster",
      name: "Authentication Service",
      role: "service",
      zone: "us-east-1a",
      host_node: "Node-02",
      status: "healthy",
      latency_ms: 14.8,
      error_rate_pct: 0.0,
      rps: 1850,
      cpu_pct: 28.5,
      memory_pct: 48.0,
      active_connections: 30,
      max_connections: 200,
      replica_count: 3,
      target_replicas: 3,
      is_isolated: false,
      upstream_ids: ["ingress-gw-01"],
      downstream_ids: ["postgres-cluster-primary"],
    },
    "payment-svc-cluster": {
      id: "payment-svc-cluster",
      name: "Payment Processing Engine",
      role: "service",
      zone: "us-east-1b",
      host_node: "Node-04",
      status: "healthy",
      latency_ms: 19.2,
      error_rate_pct: 0.0,
      rps: 940,
      cpu_pct: 41.2,
      memory_pct: 54.0,
      active_connections: 28,
      max_connections: 150,
      replica_count: 3,
      target_replicas: 3,
      is_isolated: false,
      upstream_ids: ["ingress-gw-01"],
      downstream_ids: ["postgres-cluster-primary"],
    },
    "postgres-cluster-primary": {
      id: "postgres-cluster-primary",
      name: "PostgreSQL Primary Cluster",
      role: "database",
      zone: "us-east-1a",
      host_node: "Node-03",
      status: "healthy",
      latency_ms: 18.2,
      error_rate_pct: 0.0,
      rps: 1450,
      cpu_pct: 45.0,
      memory_pct: 62.0,
      active_connections: 45,
      max_connections: 100,
      replica_count: 2,
      target_replicas: 2,
      is_isolated: false,
      upstream_ids: ["auth-svc-cluster", "payment-svc-cluster"],
      downstream_ids: [],
    },
  };

  const currentNodes = Object.keys(nodes).length > 0 ? nodes : defaultNodes;
  const activeNode = currentNodes[selectedNodeId] || Object.values(currentNodes)[0];

  const getNodeIcon = (role: string) => {
    switch (role) {
      case "gateway":
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case "database":
        return <Database className="w-3.5 h-3.5 text-indigo-400" />;
      case "service":
        return <CreditCard className="w-3.5 h-3.5 text-cyan-300" />;
      default:
        return <Server className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse";
      case "degraded":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "recovering":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse";
      case "isolated":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-0 font-mono text-xs gap-2.5">
      
      {/* 1. TOP 2x2 GRID (flex-1 min-h-0) */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
        {Object.values(currentNodes).map((node) => {
          const isSelected = node.id === activeNode?.id;
          const isCritical = node.status === "critical";

          return (
            <motion.div
              key={node.id}
              onClick={() => {
                playChime("click");
                setSelectedNodeId(node.id);
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "p-3 rounded-2xl cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden backdrop-blur-xl border",
                isSelected
                  ? "bg-[#0E1524]/90 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30"
                  : "bg-[#0B101B]/80 hover:bg-[#0E1524]/70 border-cyan-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
                isCritical ? "border-rose-500/50 bg-rose-950/20 shadow-[0_0_25px_rgba(244,63,94,0.3)]" : ""
              )}
            >
              {/* Top Row: Icon + Full Title + Status Pill */}
              <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-cyan-500/10">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    {getNodeIcon(node.role)}
                  </div>
                  <h3 className="font-bold text-slate-100 text-[11px] tracking-tight font-serif leading-tight">
                    {node.name}
                  </h3>
                </div>

                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase border shrink-0",
                    getStatusBadge(node.status)
                  )}
                >
                  {node.status}
                </span>
              </div>

              {/* Middle Metric Grid (2x2) */}
              <div className="grid grid-cols-2 gap-1.5 my-1.5">
                <div className="bg-[#060A12]/80 p-1.5 rounded-lg border border-cyan-500/10 flex flex-col justify-center">
                  <span className="text-[8px] text-slate-400 font-sans leading-none mb-0.5">P99 Latency</span>
                  <span
                    className={cn(
                      "font-bold text-[11px] leading-none",
                      node.latency_ms > 100 ? "text-rose-400" : "text-emerald-400"
                    )}
                  >
                    {node.latency_ms.toFixed(1)}ms
                  </span>
                </div>

                <div className="bg-[#060A12]/80 p-1.5 rounded-lg border border-cyan-500/10 flex flex-col justify-center">
                  <span className="text-[8px] text-slate-400 font-sans leading-none mb-0.5">Error Rate</span>
                  <span
                    className={cn(
                      "font-bold text-[11px] leading-none",
                      node.error_rate_pct > 0.5 ? "text-rose-400" : "text-emerald-400"
                    )}
                  >
                    {node.error_rate_pct.toFixed(1)}%
                  </span>
                </div>

                <div className="bg-[#060A12]/80 p-1.5 rounded-lg border border-cyan-500/10 flex flex-col justify-center">
                  <span className="text-[8px] text-slate-400 font-sans leading-none mb-0.5">Throughput</span>
                  <span className="font-bold text-[11px] text-cyan-300 leading-none">
                    {formatRPS(node.rps)}
                  </span>
                </div>

                <div className="bg-[#060A12]/80 p-1.5 rounded-lg border border-cyan-500/10 flex flex-col justify-center">
                  <span className="text-[8px] text-slate-400 font-sans leading-none mb-0.5">DB Conns / CPU</span>
                  <span className="font-bold text-[11px] text-slate-200 leading-none">
                    {node.role === "database"
                      ? `${node.active_connections}/${node.max_connections}`
                      : `${node.cpu_pct.toFixed(0)}% CPU`}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Zone & Replicas */}
              <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1 border-t border-cyan-500/10">
                <span className="text-slate-400">{node.zone} • {node.host_node}</span>
                <span className="text-cyan-300/90 font-bold">{node.replica_count} Replicas</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. BOTTOM ACTIVE SERVICE INSPECTOR (Fixed Height ~80px) */}
      <div className="h-[80px] bg-[#0B101B]/80 backdrop-blur-xl border border-cyan-500/15 rounded-2xl p-2.5 flex items-center justify-between gap-3 shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        
        {/* Left: Active Service Identity */}
        <div className="flex items-center gap-2 min-w-[170px]">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
            {getNodeIcon(activeNode.role)}
          </div>
          <div className="leading-tight">
            <h4 className="font-bold text-slate-100 text-xs font-serif truncate max-w-[130px]">
              {activeNode.name}
            </h4>
            <span className="text-[8px] text-slate-400 font-mono">
              {activeNode.host_node} • {activeNode.zone}
            </span>
          </div>
        </div>

        {/* Center: Live Pod Replicas Visualizer */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xs justify-center">
          {Array.from({ length: Math.min(activeNode.replica_count, 5) }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-[#060A12] border border-cyan-500/20 p-1 rounded-lg text-center leading-none"
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] text-slate-300 font-bold">Pod-{i + 1}</span>
              </div>
              <span className="text-[7px] text-slate-400">
                {(20 + i * 4).toFixed(0)}MB
              </span>
            </div>
          ))}
        </div>

        {/* Right: Scale & Quarantine Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-0.5 bg-[#060A12] p-0.5 rounded-lg border border-cyan-500/15">
            <button
              onClick={() => onScaleService && onScaleService(activeNode.name, Math.max(1, activeNode.replica_count - 1))}
              className="w-5 h-5 rounded flex items-center justify-center bg-[#111A2B] hover:bg-[#1A263D] text-slate-300 transition-all"
              title="Scale down replica"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <span className="px-1.5 text-[9px] font-bold text-cyan-300">
              {activeNode.replica_count}
            </span>
            <button
              onClick={() => onScaleService && onScaleService(activeNode.name, activeNode.replica_count + 1)}
              className="w-5 h-5 rounded flex items-center justify-center bg-[#111A2B] hover:bg-[#1A263D] text-slate-300 transition-all"
              title="Scale up replica"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>

          <button
            onClick={() => onIsolateNode && onIsolateNode(activeNode.id)}
            className="px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/30 transition-all text-[9px] font-semibold flex items-center gap-1"
          >
            <Lock className="w-2.5 h-2.5 text-cyan-300" />
            <span>Quarantine</span>
          </button>
        </div>

      </div>

    </div>
  );
};
