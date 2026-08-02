import React from "react";

interface SeorchableLogoProps {
  className?: string;
  glow?: boolean;
  monochrome?: boolean;
}

/**
 * High-fidelity, custom SVG rendering of the seorchable.ir signature logo.
 * Modeled after the hand-drawn, asymmetrical, sharp-pointed tapered star in the reference image.
 * Fully supports dark/light themes, responsive sizing, and interactive hover glow effects.
 */
export function SeorchableLogo({
  className = "w-9 h-9",
  glow = true,
  monochrome = false,
}: SeorchableLogoProps) {
  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {/* Background Glow Effect */}
      {glow && !monochrome && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8] to-[#f97316] rounded-full blur-md opacity-40 animate-pulse pointer-events-none scale-110" />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-500 hover:rotate-12 cursor-pointer"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Hand-drawn Asymmetrical 6-Point Tapered Star Path */}
        <path
          d="M 48 39
             L 18 14
             L 42 38
             L 46.5 21
             L 50 39
             L 84 19
             L 53 43
             L 46 86
             L 44 45
             L 9 52
             Z"
          fill={monochrome ? "currentColor" : "url(#logo-gradient)"}
          stroke={monochrome ? "currentColor" : "url(#logo-gradient)"}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Optional decorative small dot or trademark */}
        <circle cx="91" cy="23" r="1.5" fill={monochrome ? "currentColor" : "#f97316"} />
      </svg>
    </div>
  );
}
