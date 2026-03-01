"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, User, Dumbbell } from "lucide-react";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  placeholderIcon?: "camera" | "user" | "dumbbell";
  placeholderText?: string;
  priority?: boolean;
}

const iconMap = {
  camera: Camera,
  user: User,
  dumbbell: Dumbbell,
};

export default function ImageWithPlaceholder({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  placeholderIcon = "camera",
  placeholderText,
  priority = false,
}: ImageWithPlaceholderProps) {
  const [error, setError] = useState(false);
  const Icon = iconMap[placeholderIcon];

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800/50 flex flex-col items-center justify-center gap-3 ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <Icon className="w-10 h-10 text-gold/30" />
        {placeholderText && (
          <span className="text-xs text-gray-600 text-center px-4">
            {placeholderText}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      priority={priority}
    />
  );
}
