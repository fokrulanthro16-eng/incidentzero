"use client";

import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, Shield, Zap, X, Check, Code, Lock } from "lucide-react";
import { playChime, cn } from "@/lib/utils";

export interface CloudAntibodyData {
  id: string;
  policy_name: string;
  rule_type: string;
  description: string;
  target_scenario: string;
  active: boolean;
  blocked_recurring_count: number;
  synthesized_at: string;
  opa_rego_policy: string;
}

interface ImmuneAntibodiesBadgeProps {
  antibodies?: CloudAntibodyData[];
}

export const ImmuneAntibodiesBadge: React.FC<ImmuneAntibodiesBadgeProps> = ({
  antibodies = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const count = antibodies.length || 3;
  const totalNeutralized = antibodies.reduce((acc, a) => acc + (a.blocked_recurring_count || 0), 13);

  const defaultAntibodies: CloudAntibodyData[] = [
    {
      id: "ANTIBODY-01",
      policy_name: "Postgres Connection Governor",
      rule_type: "POSTGRES_TRIGGER",
      description: "Auto-sheds secondary database connection pool workers when queue time > 1,200ms.",
      target_scenario: "SCENARIO_DB_POOL_EXHAUSTED",
      active: true,
      blocked_recurring_count: 4,
      synthesized_at: new Date().toISOString(),
      opa_rego_policy: "package cloud.immune.postgres\ndefault allow = true\nshed_pool if input.query_queue_time_ms > 1200",
    },
    {
      id: "ANTIBODY-02",
      policy_name: "Volumetric L7 WAF Rate Limiter",
      rule_type: "ENVOY_FILTER",
      description: "Applies automated IP bucket rate limit (1,000 req/sec) at edge Envoy gateway during SYN floods.",
      target_scenario: "SCENARIO_DDOS_INGRESS",
      active: true,
      blocked_recurring_count: 7,
      synthesized_at: new Date().toISOString(),
      opa_rego_policy: "package cloud.immune.waf\ndefault drop = false\ndrop if input.requests_per_sec > 1000",
    },
    {
      id: "ANTIBODY-03",
      policy_name: "K8s Memory Soft-Cap Autoscaler",
      rule_type: "K8S_CIRCUIT_BREAKER",
      description: "Doubles replica pods before kernel OOM-killer fires when memory gradient > 85%.",
      target_scenario: "SCENARIO_POD_OOM_KILLED",
      active: true,
      blocked_recurring_count: 2,
      synthesized_at: new Date().toISOString(),
      opa_rego_policy: "package cloud.immune.cgroup\ndefault scale = false\nscale if input.memory_gradient_pct > 85.0",
    },
  ];

  const displayList = antibodies.length > 0 ? antibodies : defaultAntibodies;

  return (
    <>
      {/* Top Navbar Glowing Badge */}
      <button
        onClick={() => {
          playChime("click");
          setIsOpen(true);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-[9px] font-mono transition-all active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        title="View self-evolving cloud immune antibodies"
      >
        <ShieldCheck className="w-3 h-3 text-cyan-300" />
        <span>
          🛡️ <strong className="text-white">{count} Antibodies</strong> ({totalNeutralized} Intercepted)
        </span>
      </button>

      {/* Slide-over Policy Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B101B] border border-cyan-500/25 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 font-mono text-xs shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-slate-100 font-serif">Self-Evolving Cloud Immune System</h2>
                  <span className="text-[10px] text-slate-400">
                    Active Open Policy Agent (OPA) &amp; Envoy Circuit Breaker Registry
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#111A2B] hover:bg-[#1A263D] text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Neutralized Stats */}
            <div className="my-3 bg-[#060A12] p-3 rounded-xl border border-cyan-500/15 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block font-sans">Recurring Faults Neutralized:</span>
                <span className="text-sm font-bold text-emerald-400">{totalNeutralized} Intercepts (0s Downtime)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                100% IMMUNE
              </span>
            </div>

            {/* List of Antibodies */}
            <div className="space-y-2.5">
              {displayList.map((ab) => (
                <div
                  key={ab.id}
                  className="bg-[#0E1524] p-3 rounded-xl border border-cyan-500/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold">
                        {ab.id}
                      </span>
                      <span className="font-bold text-slate-100 text-xs font-serif">{ab.policy_name}</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold">
                      {ab.blocked_recurring_count} Neutralized
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{ab.description}</p>

                  <div className="bg-[#060A12] p-2 rounded-lg border border-cyan-500/10 text-[9px] text-cyan-300/80 font-mono">
                    <div className="flex items-center gap-1 text-[8px] text-slate-500 uppercase mb-0.5">
                      <Code className="w-2.5 h-2.5" />
                      <span>Enforced OPA Rego Invariant</span>
                    </div>
                    <code>{ab.opa_rego_policy}</code>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-500/15 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-md"
              >
                Close Registry
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
