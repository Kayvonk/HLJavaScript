# HLJavaScript — React + Vite Client

React 18 + Vite frontend for the High-Level JavaScript lesson viewer.

## Text-to-Speech controls

The `TTSPlayer` (bottom-of-screen) exposes controls for the Web Speech API:

- **Rate / Pitch / Volume** sliders — each persists across sessions via `PreferencesContext` (`localStorage`).
  - `Volume` ranges `0`–`1` in `0.05` steps. Setting it to `0` mutes speech without stopping playback.
- **Mode toggle — Auto / Manual**:
  - **Auto** (default): every sentence is queued and played back-to-back.
  - **Manual**: only the current sentence plays. Press **any key** or **click the reading pane** to advance to the next sentence. Press **← (Left Arrow)** to go back. `Prev / Next` transport buttons also appear in the player.
- **Sentence highlighting** (both modes): while a README or code comment set is being read aloud, the surface swaps to a "reading pane" that renders sentences as spans. The currently-spoken sentence is highlighted with the accent color and auto-scrolled into view. Click any sentence to jump to it.

Keyboard shortcuts are ignored while focus is inside an `<input>`, `<textarea>`, `<select>`, or `contenteditable` element, so typing in the voice-picker search won't trigger advance.

Voice selection lives in the `VoicePicker` component embedded in the player.

---

## React + Vite template notes

This project was scaffolded from the Vite React template.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
