interface GoldGlowProps {
  size?: "sm" | "md" | "lg";
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

const sizeMap = {
  sm: "w-[300px] h-[300px]",
  md: "w-[500px] h-[500px]",
  lg: "w-[700px] h-[700px]",
};

const positionMap = {
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
  "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
  "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
  "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
};

export default function GoldGlow({
  size = "md",
  position = "center",
  className = "",
}: GoldGlowProps) {
  return (
    <div
      className={`absolute ${positionMap[position]} ${sizeMap[size]} bg-gold/5 rounded-full blur-[120px] pointer-events-none ${className}`}
    />
  );
}
