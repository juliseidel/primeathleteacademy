export default function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent ${className}`}
    />
  );
}
