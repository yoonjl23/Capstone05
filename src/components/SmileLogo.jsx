export default function SmileLogo({ size = "w-24 h-24", color = "text-yellow-500" }) {
    return (
      <div className={`${size} ${color} flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full drop-shadow-sm"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="3" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="4" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="4" />
        </svg>
      </div>
    )
  }