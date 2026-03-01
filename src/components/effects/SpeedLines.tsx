"use client";

interface SpeedLinesProps {
  count?: number;
  className?: string;
}

export default function SpeedLines({ count = 3, className = "" }: SpeedLinesProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent animate-speed-line"
          style={{
            top: `${20 + i * 25}%`,
            width: "30%",
            animationDelay: `${i * 1.5}s`,
            transform: "rotate(-15deg)",
          }}
        />
      ))}
    </div>
  );
}
