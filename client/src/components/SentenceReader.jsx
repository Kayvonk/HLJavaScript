import { useEffect, useRef } from "react";
import { useTTS } from "./TTSPlayer";

/**
 * Renders `sentences` as a list of clickable spans and highlights the one
 * currently being spoken (when TTS's activeSource matches `sourceKey`).
 * Auto-scrolls the highlighted sentence into view. Click a sentence to jump
 * to it; in manual mode, clicking anywhere in the reader advances.
 */
export default function SentenceReader({ sentences, sourceKey }) {
  const tts = useTTS();
  const isActive = tts.activeSource === sourceKey;
  const activeIdx = isActive ? tts.currentIndex : -1;
  const containerRef = useRef(null);

  useEffect(() => {
    if (activeIdx < 0 || !containerRef.current) return;
    const el = containerRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIdx]);

  const onContainerClick = (e) => {
    // Ignore clicks on the sentence spans themselves — they handle their own click.
    if (e.target.closest("[data-idx]")) return;
    if (tts.mode === "manual") tts.next();
  };

  return (
    <div
      ref={containerRef}
      className={`sentence-reader${tts.mode === "manual" ? " manual" : ""}`}
      onClick={onContainerClick}
      role="region"
      aria-label="Reading pane"
    >
      {sentences.map((s, i) => (
        <span
          key={i}
          data-idx={i}
          className={`sentence${i === activeIdx ? " speaking" : ""}`}
          onClick={() => tts.jumpTo(i)}
        >
          {s}{" "}
        </span>
      ))}
    </div>
  );
}
