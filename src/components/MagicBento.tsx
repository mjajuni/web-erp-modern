"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

/* ==== Type Definitions ==== */
export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

/* ==== Constants ==== */
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

/* ==== Demo Card Data ==== */
const cardData: BentoCardProps[] = [
  {
    color: "linear-gradient(135deg, #1A1F71 0%, #2E3192 100%)", // deep indigo smooth
    title: "Integrated Modules",
    description: "Centralized modules to streamline operations",
    label: "Core",
  },
  {
    color: "linear-gradient(135deg, #16213E 0%, #1B2444 100%)", // dark navy
    title: "Smart Dashboard",
    description: "Visualize performance in real-time",
    label: "Analytics",
  },
  {
    color: "linear-gradient(135deg, #273043 0%, #3B4A66 100%)", // steel grey
    title: "Automation Engine",
    description: "Automate repetitive workflows intelligently",
    label: "Process",
  },
  {
    color: "linear-gradient(135deg, #2A1B3D 0%, #41295A 100%)", // purple smooth
    title: "Access Control",
    description: "Secure role-based authentication for all users",
    label: "Security",
  },
  {
    color: "linear-gradient(135deg, #243B55 0%, #141E30 100%)", // blue-black
    title: "Integration Hub",
    description: "Seamlessly connect with third-party systems",
    label: "Connectivity",
  },
  {
    color: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)", // premium violet
    title: "Performance Insights",
    description: "Get deep operational insights instantly",
    label: "Insights",
  },
];

/* ==== Utility Functions ==== */
const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

/* ==== Particle Card ==== */
const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => particle.parentNode?.removeChild(particle),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const el = cardRef.current;
    const handleEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt)
        gsap.to(el, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
        });
    };
    const handleLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt)
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
    };
    const handleMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(el, { rotateX, rotateY, duration: 0.1, ease: "power2.out" });
      }
      if (enableMagnetism) {
        gsap.to(el, {
          x: (x - centerX) * 0.05,
          y: (y - centerY) * 0.05,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("mousemove", handleMove);
    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("mousemove", handleMove);
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
  ]);

  return (
    <div ref={cardRef} className={`${className} relative`} style={style}>
      {children}
    </div>
  );
};

/* ==== Spotlight ==== */
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spot = document.createElement("div");
    spot.className = "global-spotlight";
    spot.style.cssText = `
      position: fixed; width: 800px; height: 800px;
      border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor},0.15) 0%, rgba(${glowColor},0.05) 60%, transparent 70%);
      mix-blend-mode: screen; opacity: 0; z-index: 100;
    `;
    document.body.appendChild(spot);
    spotlightRef.current = spot;

    const move = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      gsap.to(spotlightRef.current, {
        x: e.clientX - 400,
        y: e.clientY - 400,
        opacity: 0.6,
        duration: 0.2,
        ease: "power2.out",
      });
    };
    document.addEventListener("mousemove", move);
    return () => {
      document.removeEventListener("mousemove", move);
      spot.remove();
    };
  }, [gridRef, disableAnimations, enabled, glowColor]);
  return null;
};

/* ==== Bento Grid ==== */
const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section w-full max-w-full px-4 sm:px-6 md:px-8 py-6 select-none relative"
    style={{
      fontSize: "clamp(0.9rem, 0.8rem + 0.4vw, 1.2rem)",
    }}
    ref={gridRef}
  >
    {children}
  </div>
);

/* ==== Main Component ==== */
const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{`
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          width: 100%;
        }
        .card--border-glow {
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card--border-glow:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 32px rgba(${glowColor}, 0.3);
        }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={disableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-grid">
          {cardData.map((card, index) => (
            <ParticleCard
              key={index}
              disableAnimations={disableAnimations}
              particleCount={particleCount}
              glowColor={glowColor}
              enableTilt={enableTilt}
              clickEffect={clickEffect}
              enableMagnetism={enableMagnetism}
              className={`card flex flex-col justify-between p-5 rounded-2xl border border-zinc-700 overflow-hidden ${
                enableBorderGlow ? "card--border-glow" : ""
              }`}
              style={{
                background: card.color?.includes("gradient")
                  ? card.color
                  : `linear-gradient(135deg, ${card.color}, ${card.color})`,
                color: "white",
                minHeight: "200px",
                transition: "all 0.4s ease",
                backgroundSize: "200% 200%",
                backgroundPosition: "center",
              }}
            >
              <div>
                <span className="text-sm font-medium text-zinc-400">
                  {card.label}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{card.description}</p>
              </div>
            </ParticleCard>
          ))}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
