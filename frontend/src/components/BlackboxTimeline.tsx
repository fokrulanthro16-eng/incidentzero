"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Activity,
  Server,
  Zap,
  Radio,
} from "lucide-react";
import { formatLatency, formatRPS, getStatusColor, cn, playChime } from "@/lib/utils";

export interface BlackboxFrameData {
  second_offset: number;
  timestamp: string;
  overall_health: string;
  avg_latency_ms: number;
  total_rps: number;
  global_error_rate_pct: number;
  active_connections_total: number;
  critical_node?: string | null;
}

interface BlackboxTimelineProps {
  frames?: BlackboxFrameData[];
  onScrubFrame?: (frame: BlackboxFrameData | null) => void;
}

export const BlackboxTimeline: React.FC<BlackboxTimelineProps> = ({
  frames = [],
  onScrubFrame,
}) => {
  const totalFrames = frames.length || 60;
  const [scrubberIndex, setScrubberIndex] = useState<number>(totalFrames - 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sync with incoming frames if at LIVE
  useEffect(() => {
    if (!isPlaying && scrubberIndex >= totalFrames - 2) {
      setScrubberIndex(totalFrames - 1);
    }
  }, [frames.length, totalFrames, isPlaying, scrubberIndex]);

  // Automated playback ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setScrubberIndex((prev) => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return totalFrames - 1;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalFrames]);

  const currentFrame = frames[scrubberIndex] || (frames.length > 0 ? frames[frames.length - 1] : null);
  const isLive = scrubberIndex === totalFrames - 1;
  const secondOffset = currentFrame ? currentFrame.second_offset : 0;

  const handleSliderChange = (newIdx: number) => {
    setScrubberIndex(newIdx);
    if (onScrubFrame && frames[newIdx]) {
      onScrubFrame(frames[newIdx]);
    }
  };

  const handleJumpToLive = () => {
    playChime("click");
    setScrubberIndex(totalFrames - 1);
    setIsPlaying(false);
    if (onScrubFrame) onScrubFrame(null);
  };

  return (
    <div className="bg-[#111622]/90 border border-[#1E2638] rounded-xl p-4 shadow-xl backdrop-blur-md font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Time-Travel Blackbox Flight Recorder
            </span>
            <span className="text-[10px] text-slate-400">
              Capturing ring buffer from T-60s to LIVE (1s granularity)
            </span>
          </div>
        </div>

        {/* Live / Offset Badge */}
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold animate-pulse">
              LIVE (T+0s)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
              TIME-TRAVEL: {secondOffset}s
            </span>
          )}

          {!isLive && (
            <button
              onClick={handleJumpToLive}
              className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] border border-cyan-500/40 transition-colors"
            >
              Jump to Live
            </button>
          )}
        </div>
      </div>

      {/* Scrubber Timeline Bar */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>T-60s</span>
          <span>T-45s</span>
          <span>T-30s</span>
          <span>T-15s</span>
          <span className="text-cyan-400 font-bold">LIVE (T+0s)</span>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0, totalFrames - 1)}
          value={scrubberIndex}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-2 bg-[#0A0D14] rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
        />
      </div>

      {/* Snapshot Preview Card for Selected Frame */}
      {currentFrame && (
        <div className="bg-[#0A0D14] p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div>
              <span className="text-[10px] text-slate-500 block">Snapshot at {secondOffset}s</span>
              <span className="text-xs font-bold text-slate-200">
                Health:{" "}
                <span className={getStatusColor(currentFrame.overall_health).text}>
                  {currentFrame.overall_health.toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 text-[10px] block">Latency</span>
              <span className="text-slate-200 font-bold">{formatLatency(currentFrame.avg_latency_ms)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Throughput</span>
              <span className="text-slate-200">{formatRPS(currentFrame.total_rps)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Error Rate</span>
              <span
                className={cn(
                  "font-bold",
                  currentFrame.global_error_rate_pct > 5 ? "text-rose-400" : "text-slate-200"
                )}
              >
                {currentFrame.global_error_rate_pct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
