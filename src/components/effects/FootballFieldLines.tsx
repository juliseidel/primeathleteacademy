export default function FootballFieldLines({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center line */}
        <line
          x1="500"
          y1="0"
          x2="500"
          y2="600"
          stroke="rgba(197, 165, 90, 0.04)"
          strokeWidth="1"
        />
        {/* Center circle */}
        <circle
          cx="500"
          cy="300"
          r="80"
          stroke="rgba(197, 165, 90, 0.04)"
          strokeWidth="1"
        />
        {/* Center dot */}
        <circle
          cx="500"
          cy="300"
          r="3"
          fill="rgba(197, 165, 90, 0.06)"
        />
        {/* Left penalty box */}
        <rect
          x="0"
          y="150"
          width="150"
          height="300"
          stroke="rgba(197, 165, 90, 0.03)"
          strokeWidth="1"
        />
        {/* Right penalty box */}
        <rect
          x="850"
          y="150"
          width="150"
          height="300"
          stroke="rgba(197, 165, 90, 0.03)"
          strokeWidth="1"
        />
        {/* Left goal area */}
        <rect
          x="0"
          y="220"
          width="50"
          height="160"
          stroke="rgba(197, 165, 90, 0.03)"
          strokeWidth="1"
        />
        {/* Right goal area */}
        <rect
          x="950"
          y="220"
          width="50"
          height="160"
          stroke="rgba(197, 165, 90, 0.03)"
          strokeWidth="1"
        />
        {/* Corner arcs */}
        <path d="M0,10 A10,10 0 0,0 10,0" stroke="rgba(197, 165, 90, 0.03)" strokeWidth="1" />
        <path d="M990,0 A10,10 0 0,0 1000,10" stroke="rgba(197, 165, 90, 0.03)" strokeWidth="1" />
        <path d="M0,590 A10,10 0 0,1 10,600" stroke="rgba(197, 165, 90, 0.03)" strokeWidth="1" />
        <path d="M990,600 A10,10 0 0,1 1000,590" stroke="rgba(197, 165, 90, 0.03)" strokeWidth="1" />
      </svg>
    </div>
  );
}
