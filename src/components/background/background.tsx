import { Particles } from "./particles";

export function Background({ quantity }: { quantity: number }) {
  return (
    <div
      className="absolute inset-0 z-10 animate-fade-in pointer-events-none -translate-x-10 -translate-y-40"
      aria-hidden="true"
    >
      <svg>
        <defs>
          <filter id="liquid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="100"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <canvas style={{ filter: "url(#liquid)" }} />
      <Particles quantity={quantity} />
    </div>
  );
}
