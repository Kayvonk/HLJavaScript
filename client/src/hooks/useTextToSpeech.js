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

export function useTextToSpeech({ voiceName, rate = 1, pitch = 1, volume = 1 } = {}) {
  const voices = useVoices();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const sessionRef = useRef(0);
  const sentencesRef = useRef([]);

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

  const speak = useCallback(
    (sentences, startIdx = 0) => {
      const synth = window.speechSynthesis;
      if (!synth || !sentences || !sentences.length) return;
      synth.cancel();
      const session = ++sessionRef.current;
      sentencesRef.current = sentences;
      setIsSpeaking(true);
      setIsPaused(false);

      const voice = voices.find((v) => v.name === voiceName) || voices.find((v) => v.default) || voices[0] || null;

      for (let i = startIdx; i < sentences.length; i++) {
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
        u.onstart = () => {
          if (session !== sessionRef.current) return;
          setCurrentIndex(idx);
        };
        u.onend = () => {
          if (session !== sessionRef.current) return;
          if (idx === sentences.length - 1) {
            setIsSpeaking(false);
            setIsPaused(false);
            setCurrentIndex(-1);
          }
        };
        u.onerror = () => {};
        synth.speak(u);
      }
    },
    [voices, voiceName, rate, pitch, volume],
  );

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

  return { speak, pause, stop, isSpeaking, isPaused, currentIndex, voices };
}
