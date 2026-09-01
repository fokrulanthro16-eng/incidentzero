"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, Play, X, Key, Activity } from "lucide-react";
import { playChime, cn } from "@/lib/utils";

interface VoiceprintAirlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dagTitle?: string;
}

export const VoiceprintAirlockModal: React.FC<VoiceprintAirlockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  dagTitle = "PostgreSQL Primary Connection Quarantine & Failover",
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleAuthorize = () => {
    setIsVerifying(true);
    playChime("confirm");
    setTimeout(() => {
      onConfirm();
      setIsVerifying(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs animate-fade-in">
      <div className="bg-[#0B101B] border border-cyan-500/30 rounded-2xl max-w-md w-full p-5 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.2)] relative flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-serif">
                Zero-Trust Voiceprint Airlock
              </h2>
              <span className="text-[10px] text-slate-400">Cryptographic Biometric Authentication</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-[#111A2B] text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Spectrogram Visualization Animation */}
        <div className="bg-[#060A12] p-3 rounded-xl border border-cyan-500/15 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-between w-full text-[9px] text-slate-400">
            <span>Spectrogram Entropy: <strong className="text-cyan-300">0.942</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Voice Biometric Matched: 99.8%
            </span>
          </div>

          {/* Animated Spectrogram Frequency Bars */}
          <div className="flex items-center gap-1 h-12 w-full justify-center my-1">
            {[18, 32, 24, 42, 38, 20, 48, 30, 44, 26, 36, 18, 40, 28, 46, 22].map((baseH, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${baseH * 0.4}px`, `${baseH}px`, `${baseH * 0.5}px`] }}
                transition={{ repeat: Infinity, duration: 0.8 + (i % 5) * 0.1, ease: "easeInOut" }}
                className="w-1.5 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-emerald-300"
              />
            ))}
          </div>

          <div className="w-full bg-[#090E17] p-2 rounded border border-cyan-500/10 text-[9px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Key className="w-2.5 h-2.5 text-cyan-300" />
              <span>Ed25519 Signature:</span>
            </span>
            <span className="text-cyan-200 font-mono font-bold">ed25519_sig_9f82ca71d34b9e02</span>
          </div>
        </div>

        {/* Action Description */}
        <div className="text-[11px] text-slate-300 bg-[#0E1524] p-2.5 rounded-lg border border-cyan-500/10 font-sans leading-relaxed">
          <span className="text-cyan-300 font-bold font-mono text-[9px] uppercase block mb-0.5">Target Mitigation:</span>
          {dagTitle}
        </div>

        {/* Confirmation Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-cyan-500/15">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#111A2B] hover:bg-[#1A263D] text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleAuthorize}
            disabled={isVerifying}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isVerifying ? "Verifying Signature..." : "Authorize & Deploy"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
