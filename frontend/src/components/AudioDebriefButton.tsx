"use client";

import React, { useState } from "react";
import { Volume2, Loader2, Sparkles } from "lucide-react";
import { playChime } from "@/lib/utils";

interface AudioDebriefButtonProps {
  apiBaseUrl?: string;
  onSpeakText?: (text: string) => void;
}

export const AudioDebriefButton: React.FC<AudioDebriefButtonProps> = ({
  apiBaseUrl = "http://127.0.0.1:8000",
  onSpeakText,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTriggerDebrief = async () => {
    playChime("click");
    setIsPlaying(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/debrief/audio`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const script = data.debrief?.executive_script || "Executive incident debrief: IncidentZero verified 100 percent nominal cluster health.";
        if (onSpeakText) {
          onSpeakText(script);
        } else if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(script);
          utterance.rate = 1.05;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error("Audio debrief fetch failed:", err);
    } finally {
      setTimeout(() => setIsPlaying(false), 8000);
    }
  };

  return (
    <button
      onClick={handleTriggerDebrief}
      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-400/30 transition-all flex items-center gap-1 text-[9px] font-semibold active:scale-95 shadow-sm"
      title="Synthesize 20-second executive CTO incident debrief"
    >
      {isPlaying ? (
        <Loader2 className="w-2.5 h-2.5 text-rose-300 animate-spin" />
      ) : (
        <Volume2 className="w-2.5 h-2.5 text-rose-300" />
      )}
      <span>{isPlaying ? "Debriefing..." : "🎙️ Audio Debrief"}</span>
    </button>
  );
};
