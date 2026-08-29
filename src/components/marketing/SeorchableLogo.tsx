import React from "react";
import Image from "next/image";

interface SeorchableLogoProps {
  className?: string;
  glow?: boolean;
  monochrome?: boolean;
}

/**
 * High-fidelity, custom SVG rendering of the seorchable.ir signature logo.
 * Modeled after the hand-drawn, asymmetrical, sharp-pointed tapered star in the reference image.
 * Updated to be professional dark gray (grayish-black) with a completely transparent background.
 */
export function SeorchableLogo({
  className = "w-9 h-9",
  glow = false, // Background is completely transparent by default
  monochrome = true, // Force monochrome to dark-grayish-black
}: SeorchableLogoProps) {
  // We use a professional grayish-black/dark gray color: #2d3139
  const darkGrayColor = "#2d3139";

  return (
    <div className={`relative inline-block shrink-0 ${className} flex items-center justify-center`}>
      {/* Background Glow is completely disabled or transparent */}
      {glow && (
        <div className="absolute inset-0 bg-transparent rounded-full pointer-events-none scale-110" />
      )}

      <div className="relative w-full h-full z-10 transition-transform duration-500 hover:rotate-12 cursor-pointer">
        <Image src="/logo-transparent.png" alt="Seorchable Logo" fill className="object-contain" />
      </div>
    </div>
  );
}
