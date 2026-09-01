"use client";

import React, { useState } from "react";
import { Globe, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { playChime, cn } from "@/lib/utils";

export interface RegionStatusData {
  region_id: string;
  region_name: string;
  status: string;
  latency_ms: number;
  healthy: boolean;
  active_connections: number;
  packet_loss_pct: number;
}

export interface GlobalMeshStateData {
  active_primary_region: string;
  mesh_protocol: string;
  regions: RegionStatusData[];
  last_failover_at?: string | null;
  zero_packet_drop_verified: boolean;
}

interface GlobalMeshFailoverProps {
  mesh?: GlobalMeshStateData | null;
  onFailover?: (fromReg: string, toReg: string) => Promise<void>;
}

export const GlobalMeshFailover: React.FC<GlobalMeshFailoverProps> = ({
  mesh,
  onFailover,
}) => {
  const [isFailingOver, setIsFailingOver] = useState(false);
  const activeRegion = mesh?.active_primary_region || "us-east-1";

  const defaultRegions: RegionStatusData[] = [
    {
      region_id: "us-east-1",
      region_name: "US East (N. Virginia)",
      status: activeRegion === "us-east-1" ? "ACTIVE" : "STANDBY",
      latency_ms: 18.2,
      healthy: true,
      active_connections: activeRegion === "us-east-1" ? 2480 : 120,
      packet_loss_pct: 0.0,
    },
    {
      region_id: "eu-west-1",
      region_name: "EU West (Ireland)",
      status: activeRegion === "eu-west-1" ? "ACTIVE" : "STANDBY",
      latency_ms: 38.4,
      healthy: true,
      active_connections: activeRegion === "eu-west-1" ? 2480 : 120,
      packet_loss_pct: 0.0,
    },
    {
      region_id: "ap-south-1",
      region_name: "AP South (Mumbai)",
      status: activeRegion === "ap-south-1" ? "ACTIVE" : "STANDBY",
      latency_ms: 64.1,
      healthy: true,
      active_connections: 85,
      packet_loss_pct: 0.0,
    },
  ];

  const regions = mesh?.regions?.length ? mesh.regions : defaultRegions;

  const handleTriggerFailover = async (targetReg: string) => {
    if (targetReg === activeRegion || isFailingOver) return;
    setIsFailingOver(true);
    playChime("confirm");
    try {
      if (onFailover) {
        await onFailover(activeRegion, targetReg);
      } else {
        await fetch(`http://127.0.0.1:8000/api/mesh/failover?from_region=${activeRegion}&to_region=${targetReg}`, {
          method: "POST",
        });
      }
    } finally {
      setIsFailingOver(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#090E17] border border-cyan-500/15 p-1 rounded-xl text-[9px] font-mono shrink-0">
      <div className="flex items-center gap-1 px-1.5 text-slate-400">
        <Globe className="w-2.5 h-2.5 text-cyan-300" />
        <span className="hidden sm:inline">Global Mesh:</span>
      </div>

      <div className="flex items-center gap-1">
        {regions.map((reg) => {
          const isActive = reg.region_id === activeRegion;
          return (
            <button
              key={reg.region_id}
              onClick={() => handleTriggerFailover(reg.region_id)}
              disabled={isActive || isFailingOver}
              className={cn(
                "px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all",
                isActive
                  ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-bold shadow-sm"
                  : "bg-[#0F1626] hover:bg-[#162138] text-slate-400 hover:text-slate-200 border border-cyan-500/10"
              )}
              title={isActive ? `Active Primary Region (${reg.latency_ms}ms)` : `Click to trigger zero-packet-drop failover to ${reg.region_id}`}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                )}
              />
              <span>{reg.region_id}</span>
              <span className="text-[8px] text-slate-500">{reg.latency_ms.toFixed(0)}ms</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
