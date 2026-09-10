import { useCallback, useEffect, useRef, useState } from "react";

function prepareForSpeech(text) {
  return text
    .replace(/[–—]/g, ", ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function useVoices() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const load = () => {
      const v = synth.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    synth.addEventListener?.("voiceschanged", load);
    return () => synth.removeEventListener?.("voiceschanged", load);
  }, []);

  return voices;
}

/**
 * Web Speech synthesis wrapper.
 *
 * Options: voiceName, rate, pitch, volume.
 *
 * Returns { speak, pause, stop, next, prev, jumpTo, isSpeaking, isPaused, currentIndex, voices }.
 *
 * speak(sentences, startIdx=0, mode="auto"): "auto" queues every remaining
 * sentence back-to-back; "manual" speaks only one and waits for next()/prev()
 * /jumpTo(i) to advance. currentIndex reflects the currently-spoken sentence
 * (or -1 when idle) so consumers can render highlighting.
 */
export function useTextToSpeech({ voiceName, rate = 1, pitch = 1, volume = 1 } = {}) {
  const voices = useVoices();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const sessionRef = useRef(0);
  const sentencesRef = useRef([]);
  const modeRef = useRef("auto");
  const currentIndexRef = useRef(-1);
  const settingsRef = useRef({ voiceName, rate, pitch, volume, voices });

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    settingsRef.current = { voiceName, rate, pitch, volume, voices };
  }, [voiceName, rate, pitch, volume, voices]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const id = setInterval(() => {
      if (isSpeaking && !isPaused && synth.paused) synth.resume();
    }, 5000);
    return () => clearInterval(id);
  }, [isSpeaking, isPaused]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    sessionRef.current++;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentIndex(-1);
  }, []);

  const queueFrom = useCallback((sentences, startIdx, mode, session) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const { voiceName, rate, pitch, volume, voices } = settingsRef.current;
    const voice =
      voices.find((v) => v.name === voiceName) ||
      voices.find((v) => v.default) ||
      voices[0] ||
      null;

    const endIdx = mode === "manual" ? Math.min(startIdx + 1, sentences.length) : sentences.length;
    let queued = 0;

    for (let i = startIdx; i < endIdx; i++) {
      const spoken = prepareForSpeech(sentences[i]);
      if (!spoken) continue;
      const u = new SpeechSynthesisUtterance(spoken);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      }
      u.rate = rate;
      u.pitch = pitch;
      u.volume = volume;
      const idx = i;
      const isLastInBatch = i === endIdx - 1;
      u.onstart = () => {
        if (session !== sessionRef.current) return;
        setCurrentIndex(idx);
      };
      u.onend = () => {
        if (session !== sessionRef.current) return;
        if (mode === "manual") {
          // In manual mode we keep the highlight on the sentence just spoken
          // and wait for next() / prev() / jumpTo() to advance.
          return;
        }
        if (idx === sentences.length - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentIndex(-1);
        }
      };
      u.onerror = () => {};
      synth.speak(u);
      queued++;
    }

    if (queued === 0 && mode === "manual" && startIdx < sentences.length - 1) {
      // Skipped an empty sentence in manual mode — try the next one.
      queueFrom(sentences, startIdx + 1, mode, session);
    }
  }, []);

  const speak = useCallback(
    (sentences, startIdx = 0, mode = "auto") => {
      const synth = window.speechSynthesis;
      if (!synth || !sentences || !sentences.length) return;
      synth.cancel();
      const session = ++sessionRef.current;
      sentencesRef.current = sentences;
      modeRef.current = mode;
      setIsSpeaking(true);
      setIsPaused(false);
      queueFrom(sentences, startIdx, mode, session);
    },
    [queueFrom],
  );

  const jumpTo = useCallback(
    (i) => {
      const sentences = sentencesRef.current;
      if (!sentences || i < 0 || i >= sentences.length) return;
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const session = ++sessionRef.current;
      setIsSpeaking(true);
      setIsPaused(false);
      queueFrom(sentences, i, modeRef.current, session);
    },
    [queueFrom],
  );

  const next = useCallback(() => {
    const sentences = sentencesRef.current;
    if (!sentences || !sentences.length) return;
    const idx = currentIndexRef.current;
    const target = idx < 0 ? 0 : idx + 1;
    if (target >= sentences.length) {
      stop();
      return;
    }
    const synth = window.speechSynthesis;
    if (synth) synth.cancel();
    const session = ++sessionRef.current;
    setIsSpeaking(true);
    setIsPaused(false);
    queueFrom(sentences, target, modeRef.current, session);
  }, [queueFrom, stop]);

  const prev = useCallback(() => {
    const sentences = sentencesRef.current;
    if (!sentences || !sentences.length) return;
    const idx = currentIndexRef.current;
    const target = Math.max(0, (idx < 0 ? 0 : idx) - 1);
    const synth = window.speechSynthesis;
    if (synth) synth.cancel();
    const session = ++sessionRef.current;
    setIsSpeaking(true);
    setIsPaused(false);
    queueFrom(sentences, target, modeRef.current, session);
  }, [queueFrom]);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth || !isSpeaking) return;
    if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  return { speak, pause, stop, next, prev, jumpTo, isSpeaking, isPaused, currentIndex, voices };
}
