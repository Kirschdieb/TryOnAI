// Simple icons for backgrounds
export function BeachIcon({ className = "w-5 h-5 mr-2 inline-block align-middle" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="18" r="4" fill="#FFD580" />
      <rect x="2" y="20" width="20" height="2" fill="#4FC3F7" />
      <circle cx="18" cy="8" r="3" fill="#FFEB3B" />
    </svg>
  );
}

export function RainIcon({ className = "w-5 h-5 mr-2 inline-block align-middle" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <ellipse cx="12" cy="10" rx="7" ry="4" fill="#90CAF9" />
      <line x1="8" y1="16" x2="8" y2="20" stroke="#2196F3" strokeWidth="2" />
      <line x1="12" y1="16" x2="12" y2="20" stroke="#2196F3" strokeWidth="2" />
      <line x1="16" y1="16" x2="16" y2="20" stroke="#2196F3" strokeWidth="2" />
    </svg>
  );
}

export function SnowIcon({ className = "w-5 h-5 mr-2 inline-block align-middle" }) {
  // Schneeflocke
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <g>
        <circle cx="12" cy="12" r="5" fill="#E3F2FD" />
        <g stroke="#90CAF9" strokeWidth="2">
          <line x1="12" y1="6" x2="12" y2="18" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
          <line x1="15.5" y1="8.5" x2="8.5" y2="15.5" />
        </g>
      </g>
    </svg>
  );
}

export function OriginalIcon({ className = "w-5 h-5 mr-2 inline-block align-middle" }) {
  // Stern
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18.5 5.5,22 7,14.5 2,9.5 9,9" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
    </svg>
  );
}
