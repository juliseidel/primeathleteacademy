interface GridPatternProps {
  variant?: "lines" | "dots";
  className?: string;
}

export default function GridPattern({
  variant = "lines",
  className = "",
}: GridPatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${
        variant === "dots" ? "bg-dots" : "bg-field-lines"
      } ${className}`}
    />
  );
}
