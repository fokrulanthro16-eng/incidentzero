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
    [index: number]: {
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
  apiBaseUrl?: string;
}

export function useVoiceControl({
  onTranscriptReceived,
  onHotfixPRReceived,
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Speech Synthesis & Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    const recognition = new (SpeechRecognition as new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onstart: () => void;
      onend: () => void;
      onerror: (event: SpeechRecognitionErrorEvent) => void;
      onresult: (event: SpeechRecognitionEvent) => void;
      start: () => void;
      stop: () => void;
      abort: () => void;
    })();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      playChime("click");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("[SpeechRecognition Error]:", event.error);
      if (event.error === "not-allowed") {
        setIsListening(false);
      }
    };

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

    return () => {
      try {
        if (recognitionRef.current) {
          (recognitionRef.current as { abort: () => void }).abort();
        }
      } catch {
        // cleanup error
      }
    };
  }, []);

  // Set up microphone audio level analysis
  const setupAudioAnalysis = async () => {
    try {
      if (micStreamRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(avg / 128);
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      console.warn("Could not setup audio analyser:", err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

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

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      (recognitionRef.current as { start: () => void }).start();
      setupAudioAnalysis();
    } catch (err) {
      console.warn("Recognition start failed:", err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      (recognitionRef.current as { stop: () => void }).stop();
      stopAudioAnalysis();
    } catch (err) {
      console.warn("Recognition stop failed:", err);
    }
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
