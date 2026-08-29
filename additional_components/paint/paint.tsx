// Effect inspired by Paper's Liquid Metal effect

import MetallicPaint from "./MetallicPaint";

// Replace with your own SVG path
// NOTE: Your SVG should have padding around the shape to prevent cutoff
// It should have a black fill color to allow the metallic effect to show through
import logo from './logo.svg';

export default function Component() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <MetallicPaint
        imageSrc={logo}
        // Pattern
        seed={16.14}
        scale={4.4}
        patternSharpness={1.2}
        noiseScale={0.5}
        // Animation
        speed={0.3}
        liquid={0.75}
        mouseAnimation={false}
        // Visual
        brightness={2}
        contrast={0.7}
        refraction={0.033}
        blur={0.038}
        chromaticSpread={2}
        fresnel={2.4}
        angle={61}
        waveAmplitude={1}
        distortion={1}
        contour={0.4}
        // Colors
        lightColor="#cecccc"
        darkColor="#faa50a"
        tintColor="#12f4f2"
      />
    </div>
  );
}
