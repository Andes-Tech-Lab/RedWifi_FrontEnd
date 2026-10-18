/** Logo provisional (la taza con señal WiFi del portal actual). */
export default function Taza() {
  return (
    <div className="taza" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <g className="vapor">
          <path d="M38 26c-4-6 4-10 0-16" />
          <path d="M50 26c-4-6 4-10 0-16" />
          <path d="M62 26c-4-6 4-10 0-16" />
        </g>
        <path d="M24 36h52v22a26 26 0 0 1-52 0z" fill="#e8a33d" />
        <path d="M76 42h6a10 10 0 0 1 0 20h-7" fill="none" stroke="#e8a33d" strokeWidth="6" />
        <ellipse cx="50" cy="36" rx="26" ry="5" fill="#6b3e26" />
        <path className="onda" d="M42 64a11 11 0 0 1 16 0" />
        <path className="onda o2" d="M36 58a19 19 0 0 1 28 0" />
        <circle cx="50" cy="70" r="3" fill="#1b0f0a" />
      </svg>
    </div>
  );
}
