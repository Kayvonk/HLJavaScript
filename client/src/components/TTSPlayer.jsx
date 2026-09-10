import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePreferences } from "../Contexts/PreferencesContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import VoicePicker from "./VoicePicker";

const TTSContext = createContext(null);

export function useTTS() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("useTTS must be used inside <TTSProvider>");
  return ctx;
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

export function TTSProvider({ children }) {
  const prefs = usePreferences();
  const [label, setLabel] = useState("");
  const [activeSource, setActiveSource] = useState(null);
  const [visible, setVisible] = useState(false);

  const tts = useTextToSpeech({
    voiceName: prefs.ttsVoice,
    rate: prefs.ttsRate,
    pitch: prefs.ttsPitch,
    volume: prefs.ttsVolume,
  });

  const ttsRef = useRef(tts);
  useEffect(() => {
    ttsRef.current = tts;
  }, [tts]);

  const speak = useCallback(
    (sentences, sourceLabel = "", sourceKey = null, startIdx = 0) => {
      if (!sentences || !sentences.length) return;
      setLabel(sourceLabel);
      setActiveSource(sourceKey);
      setVisible(true);
      tts.speak(sentences, startIdx, prefs.ttsMode);
    },
    [tts, prefs.ttsMode],
  );

  const stop = useCallback(() => {
    tts.stop();
    setVisible(false);
    setLabel("");
    setActiveSource(null);
  }, [tts]);

  // Global keyboard advance: only active in manual mode while the player is visible.
  useEffect(() => {
    if (!visible || prefs.ttsMode !== "manual") return;
    const onKey = (e) => {
      if (isTypingTarget(e.target)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        ttsRef.current.prev();
        return;
      }
      // Any other key advances (per user request "press any button").
      // Skip pure modifier presses.
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;
      e.preventDefault();
      ttsRef.current.next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, prefs.ttsMode]);

  const value = useMemo(
    () => ({ ...tts, speak, stop, label, visible, setVisible, activeSource, mode: prefs.ttsMode }),
    [tts, speak, stop, label, visible, activeSource, prefs.ttsMode],
  );

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
}

export default function TTSPlayer() {
  const tts = useTTS();
  const prefs = usePreferences();
  if (!tts.visible) return null;

  const manual = prefs.ttsMode === "manual";

  return (
    <div className="tts-player" role="region" aria-label="Text to speech player">
      <div className="tts-player-row">
        <div className="tts-info">
          <span className="tts-status" aria-live="polite">
            {tts.isSpeaking ? (tts.isPaused ? "Paused" : "Speaking") : "Ready"}
          </span>
          {tts.label && <span className="tts-label">{tts.label}</span>}
        </div>
        <div className="tts-transport">
          {manual && (
            <button
              className="icon-btn"
              onClick={tts.prev}
              aria-label="Previous sentence"
              title="Previous"
            >
              ◀
            </button>
          )}
          <button
            className="icon-btn"
            onClick={tts.pause}
            disabled={!tts.isSpeaking}
            aria-label={tts.isPaused ? "Resume" : "Pause"}
          >
            {tts.isPaused ? "▶" : "⏸"}
          </button>
          {manual && (
            <button
              className="icon-btn"
              onClick={tts.next}
              aria-label="Next sentence"
              title="Next"
            >
              ▶▶
            </button>
          )}
          <button className="icon-btn" onClick={tts.stop} aria-label="Stop">
            ⏹
          </button>
        </div>
        <div className="tts-mode segmented" role="group" aria-label="Playback mode">
          <button
            className={!manual ? "active" : ""}
            onClick={() => prefs.setTTSMode("auto")}
            title="Auto: play all sentences continuously"
          >
            Auto
          </button>
          <button
            className={manual ? "active" : ""}
            onClick={() => prefs.setTTSMode("manual")}
            title="Manual: press any key or click to advance"
          >
            Manual
          </button>
        </div>
        <div className="tts-sliders">
          <label>
            Rate
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={prefs.ttsRate}
              onChange={(e) => prefs.setTTSRate(Number(e.target.value))}
            />
            <span>{prefs.ttsRate.toFixed(1)}</span>
          </label>
          <label>
            Pitch
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={prefs.ttsPitch}
              onChange={(e) => prefs.setTTSPitch(Number(e.target.value))}
            />
            <span>{prefs.ttsPitch.toFixed(1)}</span>
          </label>
          <label>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={prefs.ttsVolume}
              onChange={(e) => prefs.setTTSVolume(Number(e.target.value))}
            />
            <span>{prefs.ttsVolume.toFixed(2)}</span>
          </label>
        </div>
        <VoicePicker compact />
      </div>
    </div>
  );
}
