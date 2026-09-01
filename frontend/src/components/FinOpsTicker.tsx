"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, TrendingDown, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FinOpsData {
  status: string;
  loss_per_min_usd: number;
  dropped_rps: number;
  sla_penalty_tier: string;
  capital_preserved_usd: number;
  mttr_seconds: number;
  roi_efficiency_pct: number;
  total_exposure_accumulated_usd: number;
}

interface FinOpsTickerProps {
  finops?: FinOpsData | null;
}

export const FinOpsTicker: React.FC<FinOpsTickerProps> = ({ finops }) => {
  const status = finops?.status || "HEALTHY";
  const [lossCounter, setLossCounter] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "OUTAGE_EXPOSURE") {
      interval = setInterval(() => {
        setLossCounter((prev) => prev + (finops?.loss_per_min_usd ? finops.loss_per_min_usd / 60 : 23.6));
      }, 1000);
    } else {
      setLossCounter(0);
    }
    return () => clearInterval(interval);
  }, [status, finops?.loss_per_min_usd]);

  if (status === "CAPITAL_PRESERVED") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.25)]">
        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>
          Preserved: <strong className="text-white">${finops?.capital_preserved_usd?.toLocaleString() || "12,650"}</strong> ({finops?.mttr_seconds || 3.4}s MTTR)
        </span>
      </div>
    );
  }

  if (status === "OUTAGE_EXPOSURE") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-[9px] font-mono shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
        <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
        <span>
          Revenue Exposure: <strong className="text-white">-${(finops?.loss_per_min_usd || 1420).toFixed(0)}/min</strong> (${lossCounter.toFixed(0)} accum)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#090E17] border border-cyan-500/15 text-slate-400 text-[9px] font-mono">
      <DollarSign className="w-3 h-3 text-cyan-400 shrink-0" />
      <span>SLA Budget: <strong className="text-slate-200">$0.00</strong> At Risk</span>
    </div>
  );
};
