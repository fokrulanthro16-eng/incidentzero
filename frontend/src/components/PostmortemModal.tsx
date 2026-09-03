"use client";

import React from "react";
import { FileText, X, CheckCircle2, ShieldCheck, Activity, Cpu, Wrench } from "lucide-react";

export interface PostmortemReportData {
  incident_id?: string;
  incidentId?: string;
  severity?: string;
  executive_summary?: string;
  executiveSummary?: string;
  root_cause_analysis?: string;
  rootCauseAnalysis?: string;
  remediation_actions?: string[];
  remediationActions?: string[];
  preventative_measures?: string[];
  preventativeMeasures?: string[];
  sla_compliance_pct?: number | string;
  slaCompliance?: number | string;
  mcp_tools_invoked?: string[];
  mcpTools?: string[];
}

interface PostmortemModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: PostmortemReportData | null;
}

export const PostmortemModal: React.FC<PostmortemModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  const incidentId =
    data?.incident_id || data?.incidentId || "INC-8941-SEV1";
  const severity =
    data?.severity || "SEV-1 (Critical)";
  const executiveSummary =
    data?.executive_summary ||
    data?.executiveSummary ||
    "Complete autonomous resolution of PostgreSQL primary connection pool exhaustion and cascading 504 gateway timeouts across Ingress and Payment services. FastMCP swarm mitigation executed with zero data loss.";
  const rootCause =
    data?.root_cause_analysis ||
    data?.rootCauseAnalysis ||
    "Unindexed analytical query spike triggered transactional deadlocks on Node-03 (PID 49102), exhausting the 100/100 connection pool and starving critical downstream payment pipelines.";
  const remediationActions =
    (data?.remediation_actions?.length ? data.remediation_actions : null) ||
    (data?.remediationActions?.length ? data.remediationActions : null) || [
      "1. Terminated blocking query PIDs via pg_terminate_backend.",
      "2. Automated zero-downtime canary reroute to standby pool.",
      "3. Generated GitOps Hotfix PR #1184.",
    ];
  const preventativeMeasures =
    (data?.preventative_measures?.length ? data.preventative_measures : null) ||
    (data?.preventativeMeasures?.length ? data.preventativeMeasures : null) || [
      "Synthesized immutable OPA antibody policy committed to registry.",
      "Adaptive token-bucket rate limiting applied to prevent pool saturation recurrence.",
    ];
  const slaCompliance =
    data?.sla_compliance_pct != null
      ? typeof data.sla_compliance_pct === "number"
        ? `${data.sla_compliance_pct}%`
        : String(data.sla_compliance_pct)
      : data?.slaCompliance != null
      ? `${data.slaCompliance}`
      : "99.98%";
  const mcpToolsCount =
    data?.mcp_tools_invoked?.length ||
    data?.mcpTools?.length ||
    4;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs animate-fade-in">
      <div className="bg-[#0B101B] border border-cyan-500/25 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.2)] relative custom-cyan-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#111A2B] hover:bg-[#1A263D] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 font-serif">
              Executive SRE Incident Postmortem
            </h2>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Incident ID: <strong className="text-cyan-300">{incidentId}</strong> • Severity: <strong className="text-rose-400">{severity}</strong>
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-cyan-500/15 my-3" />

        {/* Body Content */}
        <div className="space-y-3.5 text-slate-300">
          
          {/* Executive Summary */}
          <div>
            <span className="text-[9px] text-cyan-400 font-bold block uppercase tracking-wider mb-1">
              Executive Summary
            </span>
            <p className="bg-[#060A12] p-3 rounded-xl border border-cyan-500/10 leading-relaxed font-sans text-[11px] text-slate-200">
              {executiveSummary}
            </p>
          </div>

          {/* Root Cause Analysis */}
          <div>
            <span className="text-[9px] text-cyan-400 font-bold block uppercase tracking-wider mb-1">
              Root Cause Analysis (RCA)
            </span>
            <p className="bg-[#060A12] p-3 rounded-xl border border-cyan-500/10 leading-relaxed font-sans text-[11px] text-slate-200">
              {rootCause}
            </p>
          </div>

          {/* Remediation Actions */}
          <div>
            <span className="text-[9px] text-emerald-400 font-bold block uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Remediation Actions Executed
            </span>
            <ul className="list-disc list-inside bg-[#060A12] p-3 rounded-xl border border-cyan-500/10 space-y-1.5 font-sans text-[11px] text-slate-200">
              {remediationActions.map((act, i) => (
                <li key={i} className="leading-relaxed">{act}</li>
              ))}
            </ul>
          </div>

          {/* Preventative Measures */}
          <div>
            <span className="text-[9px] text-amber-400 font-bold block uppercase tracking-wider mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Preventative Measures &amp; Immunity
            </span>
            <ul className="list-disc list-inside bg-[#060A12] p-3 rounded-xl border border-cyan-500/10 space-y-1.5 font-sans text-[11px] text-slate-200">
              {preventativeMeasures.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center justify-between pt-3 text-slate-400 border-t border-cyan-500/15 text-[10px]">
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>SLA Compliance: {slaCompliance}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>MCP Tools: {mcpToolsCount} Invoked</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
