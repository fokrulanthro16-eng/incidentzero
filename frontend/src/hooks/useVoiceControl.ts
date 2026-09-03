"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { playChime } from "@/lib/utils";
import { GitHotfixPRData } from "@/components/GitHotfixModal";

// Web Speech API interfaces
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      length: number;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

interface UseVoiceControlProps {
  onTranscriptReceived?: (transcript: string) => void;
  onHotfixPRReceived?: (pr: GitHotfixPRData) => void;
  onTriggerScenario?: (scenarioId: string) => void;
  apiBaseUrl?: string;
}

export function useVoiceControl({
  onTranscriptReceived,
  onHotfixPRReceived,
  onTriggerScenario,
  apiBaseUrl = "http://127.0.0.1:8000",
}: UseVoiceControlProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [spokenResponse, setSpokenResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<unknown>(null);
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRec =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const recognition = new (SpeechRec as new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          start: () => void;
          stop: () => void;
          abort: () => void;
          onstart: () => void;
          onend: () => void;
          onerror: (event: SpeechRecognitionErrorEvent) => void;
          onresult: (event: SpeechRecognitionEvent) => void;
        })();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentFinal = "";
          let currentInterim = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          const activeText = (currentFinal || currentInterim).trim();
          if (activeText) {
            console.log("Transcript detected:", activeText);
            const lower = activeText.toLowerCase();

            const dbKeywords = ["simulate", "db", "outage", "database", "lock", "crash"];
            const hasDbKeyword = dbKeywords.some((kw) => lower.includes(kw));

            const now = Date.now();
            if (hasDbKeyword && now - lastTriggerTimeRef.current > 3000) {
              lastTriggerTimeRef.current = now;
              console.log("Voice trigger simulated successfully:", activeText);
              playChime("alert");
              if (onTriggerScenario) {
                onTriggerScenario("SCENARIO_DB_POOL_EXHAUSTED");
              }
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }

          if (currentFinal) {
            const cleaned = currentFinal.trim();
            setTranscript(cleaned);
            setInterimTranscript("");
            if (onTranscriptReceived) {
              onTranscriptReceived(cleaned);
            }
            sendVoiceCommand(cleaned);
          }
        };

        recognitionRef.current = recognition;
      } catch {
        // Fallback demo mode remains active
      }
    }

    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [apiBaseUrl, onTranscriptReceived, onTriggerScenario]);

  // Speak aloud response using Web Speech Synthesis
  const speakAloud = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Google") ||
        v.name.includes("Natural") ||
        v.name.includes("Samantha") ||
        v.name.includes("Zira") ||
        v.lang === "en-US"
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Send voice utterance to backend
  const sendVoiceCommand = async (text: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/voice/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setSpokenResponse(data.spoken_feedback);
        speakAloud(data.spoken_feedback);

        if (data.hotfix_pr && onHotfixPRReceived) {
          onHotfixPRReceived(data.hotfix_pr);
        }

        if (data.requires_confirmation) {
          playChime("alert");
        } else {
          playChime("confirm");
        }
      }
    } catch (err) {
      console.error("[Voice Command Error]:", err);
    }
  };

  // Bulletproof Demo Voice Mode: immediately switches to Listening & auto-triggers after 2.5s
  const startListening = () => {
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);

    setIsListening(true);
    playChime("click");

    // Start synthetic waveform animation pulse
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel(0.4 + Math.random() * 0.55);
    }, 120);

    // Try hardware recognition if available
    try {
      if (recognitionRef.current) {
        (recognitionRef.current as { start: () => void }).start();
      }
    } catch {
      // Ignore mic access errors; bulletproof fallback proceeds
    }

    // 2.5 second demo trigger timer
    demoTimerRef.current = setTimeout(() => {
      console.log("Voice trigger simulated successfully");
      playChime("alert");
      const demoTranscript = "Simulate PostgreSQL database pool exhaustion";
      setTranscript(demoTranscript);
      setInterimTranscript("");

      if (onTriggerScenario) {
        onTriggerScenario("SCENARIO_DB_POOL_EXHAUSTED");
      } else {
        fetch(`${apiBaseUrl}/api/chaos/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario_id: "SCENARIO_DB_POOL_EXHAUSTED" }),
        }).catch(() => {});
      }

      sendVoiceCommand(demoTranscript);

      // Reset listening state after trigger
      setIsListening(false);
      setAudioLevel(0);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }, 2500);
  };

  const stopListening = () => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    try {
      if (recognitionRef.current) {
        (recognitionRef.current as { stop: () => void }).stop();
      }
    } catch {
      // safe ignore
    }
    setIsListening(false);
    setAudioLevel(0);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    isSpeaking,
    isSupported,
    transcript,
    interimTranscript,
    spokenResponse,
    audioLevel,
    startListening,
    stopListening,
    toggleListening,
    sendVoiceCommand,
    speakAloud,
  };
}
