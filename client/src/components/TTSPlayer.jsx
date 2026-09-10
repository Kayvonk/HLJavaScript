import { createContext, useContext, useMemo, useState } from "react";
import { usePreferences } from "../Contexts/PreferencesContext";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import VoicePicker from "./VoicePicker";

const TTSContext = createContext(null);

export function useTTS() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("useTTS must be used inside <TTSProvider>");
  return ctx;
}

export function TTSProvider({ children }) {
  const prefs = usePreferences();
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const tts = useTextToSpeech({
    voiceName: prefs.ttsVoice,
    rate: prefs.ttsRate,
    pitch: prefs.ttsPitch,
    volume: prefs.ttsVolume,
  });

  const speak = (sentences, sourceLabel = "") => {
    if (!sentences || !sentences.length) return;
    setLabel(sourceLabel);
    setVisible(true);
    tts.speak(sentences, 0);
  };

  const stop = () => {
    tts.stop();
    setVisible(false);
    setLabel("");
  };

  const value = useMemo(
    () => ({ ...tts, speak, stop, label, visible, setVisible }),
    [tts, label, visible],
  );

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
}

export default function TTSPlayer() {
  const tts = useTTS();
  const prefs = usePreferences();
  if (!tts.visible) return null;

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
          <button
            className="icon-btn"
            onClick={tts.pause}
            disabled={!tts.isSpeaking}
            aria-label={tts.isPaused ? "Resume" : "Pause"}
          >
            {tts.isPaused ? "▶" : "⏸"}
          </button>
          <button className="icon-btn" onClick={tts.stop} aria-label="Stop">
            ⏹
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
        </div>
        <VoicePicker compact />
      </div>
    </div>
  );
}
