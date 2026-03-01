interface GoldGlowProps {
  size?: "sm" | "md" | "lg" | "xl";
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

const sizeMap = {
  sm: "w-[300px] h-[300px] blur-[80px]",
  md: "w-[500px] h-[500px] blur-[120px]",
  lg: "w-[700px] h-[700px] blur-[160px]",
  xl: "w-[900px] h-[900px] blur-[200px]",
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
      className={`absolute ${positionMap[position]} ${sizeMap[size]} bg-gold/[0.07] rounded-full pointer-events-none ${className}`}
    />
  );
}
