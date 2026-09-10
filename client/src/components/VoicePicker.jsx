import { useVoices } from "../hooks/useTextToSpeech";
import { usePreferences } from "../Contexts/PreferencesContext";

export default function VoicePicker({ compact = false }) {
  const voices = useVoices();
  const { ttsVoice, setTTSVoice } = usePreferences();
  const local = voices.filter((v) => v.localService);
  const remote = voices.filter((v) => !v.localService);
  return (
    <label className={`voice-picker ${compact ? "compact" : ""}`}>
      {!compact && <span>Voice</span>}
      <select value={ttsVoice ?? ""} onChange={(e) => setTTSVoice(e.target.value || null)}>
        <option value="">Default</option>
        {local.length > 0 && (
          <optgroup label="Local">
            {local.map((v) => (
              <option key={v.name} value={v.name}>
                {v.default ? "★ " : ""}
                {v.name} ({v.lang})
              </option>
            ))}
          </optgroup>
        )}
        {remote.length > 0 && (
          <optgroup label="Network">
            {remote.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </label>
  );
}
