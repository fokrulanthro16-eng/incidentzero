"use client";

import React, { useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  transcript: string;
  interimTranscript: string;
  spokenResponse: string;
  onToggleListen: () => void;
  onQuickCommand: (cmd: string) => void;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  audioLevel,
  transcript,
  interimTranscript,
  spokenResponse,
  onToggleListen,
  onQuickCommand,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas waveform renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const barCount = 48;
      const barWidth = width / barCount - 2;

      // Draw dynamic glowing bars
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const bellCurve = Math.cos(distFromCenter * Math.PI * 0.5);

        let amplitude = 4;
        if (isListening) {
          const sineMod = Math.sin(phase + i * 0.3) * 0.5 + 0.5;
          amplitude = 6 + (audioLevel * 45 + sineMod * 12) * bellCurve;
        } else if (isSpeaking) {
          const sineMod = Math.sin(phase * 1.8 + i * 0.45) * 0.5 + 0.5;
          amplitude = 5 + (18 + sineMod * 22) * bellCurve;
        }

        const barHeight = Math.min(height - 4, Math.max(4, amplitude));
        const y = centerY - barHeight / 2;

        // Gradient color based on state
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, "rgba(0, 240, 255, 0.9)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.5)");
        } else if (isListening) {
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.9)");
          gradient.addColorStop(1, "rgba(0, 240, 255, 0.4)");
        } else {
          gradient.addColorStop(0, "rgba(71, 85, 105, 0.4)");
          gradient.addColorStop(1, "rgba(30, 41, 59, 0.2)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isListening, isSpeaking, audioLevel]);

  const quickCommands = [
    { label: "⚡ Confirm Execute", cmd: "Confirm execute" },
    { label: "📊 Cluster Status", cmd: "What is the cluster status?" },
    { label: "💥 Simulate DB Lock", cmd: "Simulate database connection pool outage" },
    { label: "💀 Simulate OOM Kill", cmd: "Simulate OOM kill on Auth Service" },
    { label: "🌊 Simulate DDoS", cmd: "Simulate volumetric DDoS attack" },
    { label: "📄 Postmortem", cmd: "Generate postmortem report" },
  ];

  return (
    <div className="bg-[#111622]/90 border border-[#1E2638] rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Background neon ambient pulse */}
      <div
        className={cn(
          "absolute -right-16 -top-16 w-40 h-40 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none",
          isSpeaking
            ? "bg-cyan-500/20 opacity-100"
            : isListening
            ? "bg-emerald-500/20 opacity-100"
            : "bg-cyan-500/5 opacity-40"
        )}
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Alexa+ Pulsing Microphone Trigger */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Concentric Alexa-style glowing ring */}
            <div
              className={cn(
                "absolute -inset-2 rounded-full transition-all duration-500 pointer-events-none",
                isListening
                  ? "bg-emerald-500/30 blur-md animate-pulse"
                  : isSpeaking
                  ? "bg-cyan-500/30 blur-md animate-pulse"
                  : "opacity-0"
              )}
            />
            <button
              onClick={onToggleListen}
              className={cn(
                "relative z-10 w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 transform active:scale-95",
                isListening
                  ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]"
                  : isSpeaking
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.7)]"
                  : "bg-[#161D2E] text-slate-300 border-slate-700 hover:border-cyan-400/60 hover:text-white"
              )}
              title={isListening ? "Click to Mute Voice Recognition" : "Click to Activate Alexa+ Voice Command"}
            >
              {isListening ? (
                <Mic className="w-6 h-6 animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-6 h-6 animate-bounce" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Amazon Alexa+ Track Engine
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] font-mono rounded-full border",
                  isListening
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse"
                    : isSpeaking
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                )}
              >
                {isListening ? "LISTENING" : isSpeaking ? "SPEAKING" : "VOICE READY"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isListening
                ? "Speak SRE command or 'Confirm execute'..."
                : isSpeaking
                ? "IncidentZero responding with audio synthesis..."
                : "Push mic or click command chip below"}
            </p>
          </div>
        </div>

        {/* Center: Dynamic Audio Waveform Canvas */}
        <div className="flex-1 w-full lg:max-w-md bg-[#0A0D14] border border-[#1E2638] rounded-lg p-2 h-14 flex items-center justify-center">
          <canvas ref={canvasRef} width={380} height={40} className="w-full h-full" />
        </div>

        {/* Right: Quick Voice Command Chips */}
        <div className="flex items-center flex-wrap gap-1.5 max-w-lg justify-end">
          {quickCommands.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickCommand(item.cmd)}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#161D2E] hover:bg-cyan-500/20 border border-slate-700/70 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transcription & Spoken Feedback Ticker */}
      {(transcript || interimTranscript || spokenResponse) && (
        <div className="mt-3 pt-3 border-t border-[#1E2638] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-[#0A0D14]/80 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              User Spoken Transcript:
            </span>
            <p className="text-emerald-300">
              {transcript || <span className="text-slate-500 italic">Listening...</span>}
              {interimTranscript && <span className="text-slate-400 opacity-70"> {interimTranscript}</span>}
            </p>
          </div>

          <div className="bg-[#0A0D14]/80 p-2.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              Alexa+ / Bedrock Spoken Response:
            </span>
            <p className="text-cyan-300">{spokenResponse || <span className="text-slate-500 italic">Awaiting query...</span>}</p>
          </div>
        </div>
      )}
    </div>
  );
};
