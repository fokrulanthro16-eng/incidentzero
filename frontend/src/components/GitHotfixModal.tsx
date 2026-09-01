"use client";

import React, { useState } from "react";
import { GitPullRequest, GitCommit, Check, Copy, ExternalLink, X, FileCode, CheckCircle2 } from "lucide-react";
import { playChime } from "@/lib/utils";

export interface GitHotfixPRData {
  pr_number: number;
  title: string;
  branch: string;
  author: string;
  status: string;
  created_at: string;
  summary: string;
  affected_files: string[];
  unified_diff: string;
  commit_sha: string;
}

interface GitHotfixModalProps {
  pr: GitHotfixPRData | null;
  isOpen: boolean;
  onClose: () => void;
  onMerge: (prNumber: number) => void;
}

export const GitHotfixModal: React.FC<GitHotfixModalProps> = ({
  pr,
  isOpen,
  onClose,
  onMerge,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMerging, setIsMerging] = useState(false);

  if (!isOpen || !pr) return null;

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(pr.unified_diff || "");
    setCopied(true);
    playChime("click");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMergeClick = () => {
    setIsMerging(true);
    playChime("confirm");
    setTimeout(() => {
      onMerge(pr.pr_number);
      setIsMerging(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs animate-fade-in">
      <div className="bg-[#0B101B] border border-cyan-500/25 rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.2)]">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-cyan-500/15 flex items-center justify-between bg-[#0E1524]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm font-serif">Pull Request #{pr.pr_number}</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {pr.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">{pr.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#111A2B] hover:bg-[#1A263D] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 custom-cyan-scrollbar">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#060A12] p-3 rounded-xl border border-cyan-500/10 text-[10px]">
            <div>
              <span className="text-slate-500 block text-[9px]">Branch</span>
              <span className="text-cyan-300 font-bold truncate block">{pr.branch}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Author</span>
              <span className="text-slate-200 block truncate">{pr.author}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Commit SHA</span>
              <span className="text-indigo-300 font-mono block">{pr.commit_sha}</span>
            </div>
          </div>

          {/* Rationale & Summary */}
          <div className="bg-[#0E1524] p-3 rounded-xl border border-cyan-500/10 text-[11px] leading-relaxed font-sans text-slate-300">
            <span className="text-cyan-400 font-bold font-mono text-[9px] uppercase block mb-1">
              Autonomous PR Rationale:
            </span>
            {pr.summary}
          </div>

          {/* Unified Code Diff Viewer */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-300 font-bold text-[10px] flex items-center gap-1">
                <FileCode className="w-3 h-3 text-cyan-400" />
                Unified Git Diff ({pr.affected_files?.length || 2} files changed)
              </span>
              <button
                onClick={handleCopyDiff}
                className="flex items-center gap-1 text-[9px] px-2 py-1 rounded bg-[#111A2B] hover:bg-[#1A263D] text-slate-300 border border-cyan-500/15"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copied ? "Copied" : "Copy Diff"}</span>
              </button>
            </div>

            <div className="bg-[#04060A] border border-cyan-500/20 rounded-xl p-3 overflow-x-auto text-[10px] font-mono leading-relaxed max-h-56">
              <pre className="text-slate-300">
                {pr.unified_diff ||
`--- a/db/migrations/004_add_composite_index_orders.sql
+++ b/db/migrations/004_add_composite_index_orders.sql
@@ -0,0 +1,9 @@
+-- IncidentZero Auto-Generated Hotfix Migration
+-- Resolves 504 Gateway Timeouts & Unindexed Query Storm
+CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_v2_user_status_created
+  ON orders_v2 (user_id, payment_status, created_at DESC);
+
+-- Enforce statement timeout to kill runaway processes automatically
+ALTER ROLE api_worker SET statement_timeout = '4500ms';
--- a/backend/config/database.py
+++ b/backend/config/database.py
@@ -18,4 +18,6 @@
-    pool_size=20,
-    max_overflow=10,
+    pool_size=50,
+    max_overflow=25,
+    pool_timeout=15,`}
              </pre>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-cyan-500/15 flex items-center justify-between bg-[#0E1524]">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Canary Sandbox Verified: 0% Blast Radius Violation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#111A2B] hover:bg-[#1A263D] text-slate-300 font-medium"
            >
              Dismiss
            </button>
            <button
              onClick={handleMergeClick}
              disabled={isMerging || pr.status === "MERGED"}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>{isMerging ? "Merging & Rolling Out..." : pr.status === "MERGED" ? "Merged & Deployed" : "Merge Hotfix PR"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
