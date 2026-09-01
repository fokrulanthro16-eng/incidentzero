"use client";

import { useState, useEffect, useRef } from "react";
import { PredictiveRadarData } from "@/components/PredictiveRadar";
import { GitHotfixPRData } from "@/components/GitHotfixModal";
import { BlackboxFrameData } from "@/components/BlackboxTimeline";
import { BlastRadiusData } from "@/components/BlastRadiusBadge";
import { SwarmConsensusData } from "@/components/MultiAgentSwarm";
import { FinOpsData } from "@/components/FinOpsTicker";
import { CloudAntibodyData } from "@/components/ImmuneAntibodiesBadge";
import { GlobalMeshStateData } from "@/components/GlobalMeshFailover";
import { SovereignMeshStateData } from "@/components/SovereignMultiCloudPill";
import { RedTeamGANStateData } from "@/components/RedTeamGANModal";

export interface ServiceNodeData {
  id: string;
  name: string;
  role: string;
  zone: string;
  host_node: string;
  status: "healthy" | "degraded" | "critical" | "isolated" | "recovering";
  latency_ms: number;
  error_rate_pct: number;
  rps: number;
  cpu_pct: number;
  memory_pct: number;
  active_connections: number;
  max_connections: number;
  replica_count: number;
  target_replicas: number;
  is_isolated: boolean;
  upstream_ids: string[];
  downstream_ids: string[];
}

export interface TopologyData {
  timestamp: string;
  environment: string;
  overall_health: "healthy" | "degraded" | "critical" | "isolated" | "recovering";
  nodes: Record<string, ServiceNodeData>;
  active_connections_total: number;
  total_rps: number;
  avg_latency_ms: number;
  global_error_rate_pct: number;
  predictive_radar?: PredictiveRadarData;
  blast_radius?: BlastRadiusData;
  swarm_consensus?: SwarmConsensusData;
  finops?: FinOpsData;
  active_antibodies?: CloudAntibodyData[];
  global_mesh?: GlobalMeshStateData;
  sovereign_mesh?: SovereignMeshStateData;
  red_team_gan?: RedTeamGANStateData;
}

export interface TelemetryLogData {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "CRITICAL" | "AGENT";
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface DAGStepData {
  id: string;
  step_number: number;
  title: string;
  description: string;
  tool_name: string;
  parameters: Record<string, unknown>;
  destructive: boolean;
  requires_voice_confirmation: boolean;
  status: "pending" | "awaiting_confirmation" | "in_progress" | "verified" | "failed" | "skipped";
  output?: string;
  duration_ms?: number;
}

export interface RemediationDAGData {
  dag_id: string;
  incident_id: string;
  title: string;
  rationale: string;
  severity: string;
  status: "pending" | "awaiting_confirmation" | "in_progress" | "verified" | "failed";
  steps: DAGStepData[];
  created_at: string;
  completed_at?: string;
  requires_confirmation: boolean;
  confirmed_by_voice: boolean;
  hotfix_pr?: GitHotfixPRData;
  swarm_consensus?: SwarmConsensusData;
  formal_verification_proof?: string;
}

export interface IncidentData {
  incident_id: string;
  scenario_id?: string;
  title: string;
  severity: "SEV-1" | "SEV-2" | "SEV-3" | "NORMAL";
  status: "active" | "triaging" | "mitigating" | "resolved" | "idle";
  root_cause?: string;
  affected_nodes: string[];
  detected_at?: string;
  resolved_at?: string;
  active_dag?: RemediationDAGData;
  hotfix_pr?: GitHotfixPRData;
  swarm_consensus?: SwarmConsensusData;
  finops?: FinOpsData;
}

export function useSSEStream(apiUrl: string = "http://127.0.0.1:8000") {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<TopologyData | null>(null);
  const [logs, setLogs] = useState<TelemetryLogData[]>([]);
  const [activeIncident, setActiveIncident] = useState<IncidentData | null>(null);
  const [activeDAG, setActiveDAG] = useState<RemediationDAGData | null>(null);
  const [hotfixPR, setHotfixPR] = useState<GitHotfixPRData | null>(null);
  const [blackboxFrames, setBlackboxFrames] = useState<BlackboxFrameData[]>([]);
  const [preIncidentWarning, setPreIncidentWarning] = useState<PredictiveRadarData | null>(null);
  const [swarmConsensus, setSwarmConsensus] = useState<SwarmConsensusData | null>(null);
  const [finopsMetrics, setFinopsMetrics] = useState<FinOpsData | null>(null);
  const [sovereignState, setSovereignState] = useState<SovereignMeshStateData | null>(null);
  const [ganState, setGanState] = useState<RedTeamGANStateData | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connectSSE = () => {
      try {
        const streamUrl = `${apiUrl}/api/telemetry/stream`;
        const es = new EventSource(streamUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          if (isMounted) setIsConnected(true);
        };

        es.onerror = () => {
          if (isMounted) setIsConnected(false);
          es.close();
          setTimeout(() => {
            if (isMounted) connectSSE();
          }, 3000);
        };

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (!isMounted) return;

            if (data.type === "TELEMETRY_SNAPSHOT" || data.type === "TELEMETRY_TICK") {
              if (data.telemetry) {
                setTelemetry(data.telemetry);
                if (data.telemetry.swarm_consensus) setSwarmConsensus(data.telemetry.swarm_consensus);
                if (data.telemetry.finops) setFinopsMetrics(data.telemetry.finops);
                if (data.telemetry.sovereign_mesh) setSovereignState(data.telemetry.sovereign_mesh);
                if (data.telemetry.red_team_gan) setGanState(data.telemetry.red_team_gan);
              }
              if (data.logs) {
                setLogs((prev) => {
                  const newLogs = [...prev, ...data.logs];
                  const map = new Map();
                  newLogs.forEach((l) => map.set(`${l.timestamp}-${l.message}`, l));
                  return Array.from(map.values()).slice(-100);
                });
              }
              if (data.incident !== undefined) {
                setActiveIncident(data.incident);
              }
              if (data.hotfix_pr) {
                setHotfixPR(data.hotfix_pr);
              }
              if (data.blackbox_frames) {
                setBlackboxFrames(data.blackbox_frames);
              }
            } else if (data.type === "CHAOS_TRIGGERED") {
              if (data.incident) setActiveIncident(data.incident);
              if (data.dag) setActiveDAG(data.dag);
              if (data.telemetry) {
                setTelemetry(data.telemetry);
                if (data.telemetry.swarm_consensus) setSwarmConsensus(data.telemetry.swarm_consensus);
                if (data.telemetry.finops) setFinopsMetrics(data.telemetry.finops);
              }
              if (data.hotfix_pr) setHotfixPR(data.hotfix_pr);
            } else if (data.type === "CHAOS_RESET") {
              setActiveIncident(null);
              setActiveDAG(null);
              setHotfixPR(null);
              setPreIncidentWarning(null);
              setSwarmConsensus(null);
              if (data.telemetry) {
                setTelemetry(data.telemetry);
                if (data.telemetry.finops) setFinopsMetrics(data.telemetry.finops);
              }
            } else if (data.type === "DAG_COMPLETED") {
              if (data.dag) setActiveDAG(data.dag);
              if (data.telemetry) setTelemetry(data.telemetry);
              if (data.hotfix_pr) setHotfixPR(data.hotfix_pr);
            } else if (data.type === "PRE_INCIDENT_WARNING") {
              if (data.predictive_radar) setPreIncidentWarning(data.predictive_radar);
            } else if (data.type === "HOTFIX_PR_MERGED") {
              if (data.pr) setHotfixPR(data.pr);
            } else if (data.type === "SOVEREIGN_EVACUATION_EXECUTED") {
              if (data.sovereign_mesh) setSovereignState(data.sovereign_mesh);
            } else if (data.type === "RED_TEAM_BATTLE_ROUND") {
              if (data.red_team_gan) setGanState(data.red_team_gan);
            }
          } catch (err) {
            console.error("SSE parse error:", err);
          }
        };
      } catch (err) {
        console.error("EventSource initialization error:", err);
      }
    };

    connectSSE();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [apiUrl]);

  return {
    isConnected,
    telemetry,
    logs,
    activeIncident,
    activeDAG,
    hotfixPR,
    blackboxFrames,
    preIncidentWarning,
    swarmConsensus,
    finopsMetrics,
    sovereignState,
    ganState,
    setActiveDAG,
    setActiveIncident,
    setHotfixPR,
  };
}
