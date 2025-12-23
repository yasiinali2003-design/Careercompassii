'use client';

/**
 * ResultsCelebrationOverlay
 * 
 * Full-screen celebration overlay that appears when results page loads.
 * Shows for 2.5 seconds (or until skipped), then fades out.
 * 
 * To disable for debugging: Set `disabled={true}` prop
 * To adjust duration: Change `CELEBRATION_DURATION` constant (in milliseconds)
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const CELEBRATION_DURATION = 2500; // 2.5 seconds

interface ResultsCelebrationOverlayProps {
  onComplete: () => void;
  disabled?: boolean; // Set to true to disable overlay (for debugging)
}

export function ResultsCelebrationOverlay({ 
  onComplete, 
  disabled = false 
}: ResultsCelebrationOverlayProps) {
  const [isVisible, setIsVisible] = useState(!disabled);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
  }>>([]);
  const startTimeRef = useRef<number | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Skip animation if reduced motion is preferred
  useEffect(() => {
    if (shouldReduceMotion || disabled) {
      setIsVisible(false);
      onComplete();
    }
  }, [shouldReduceMotion, disabled, onComplete]);

  // Auto-hide after duration
  useEffect(() => {
    if (disabled || shouldReduceMotion) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(), 300); // Wait for fade-out animation
    }, CELEBRATION_DURATION);

    return () => clearTimeout(timer);
  }, [disabled, shouldReduceMotion, onComplete]);

  // Confetti animation
  const initParticles = useCallback(() => {
    if (!canvasRef.current || shouldReduceMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles in blue/teal palette
    const colors = [
      'rgba(56, 189, 248, 0.8)', // sky-400
      'rgba(14, 165, 233, 0.8)', // sky-500
      'rgba(20, 184, 166, 0.8)', // teal-500
      'rgba(45, 212, 191, 0.8)', // teal-400
    ];

    particlesRef.current = [];
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000)); // Limit for performance

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 100, // Start above viewport
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 2,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
      });
    }

    startTimeRef.current = Date.now();

    const animate = () => {
      if (!ctx || !startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed > CELEBRATION_DURATION) {
        // Fade out particles
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // Gravity
        particle.life -= 0.01;

        // Remove dead particles
        if (particle.life <= 0 || particle.y > canvas.height + 20) {
          particlesRef.current.splice(index, 1);
          return;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (isVisible && !shouldReduceMotion && !disabled) {
      const cleanup = initParticles();
      return cleanup;
    }
  }, [isVisible, shouldReduceMotion, disabled, initParticles]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  };

  if (disabled || shouldReduceMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1015]/95 backdrop-blur-sm"
        >
          {/* Confetti Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 max-w-2xl mx-auto px-6 sm:px-8"
          >
            <div className="
              relative
              overflow-hidden
              rounded-3xl
              border border-cyan-400/20
              bg-gradient-to-b from-white/8 via-white/4 to-white/2
              backdrop-blur-xl
              shadow-[0_24px_80px_rgba(0,0,0,0.7)]
              px-8 py-12 md:px-12 md:py-16
            ">
              {/* Subtle glow effect */}
              <div className="pointer-events-none absolute inset-x-8 -top-32 h-40 rounded-full bg-gradient-to-b from-cyan-300/20 to-transparent blur-3xl" />

              <div className="relative space-y-6 text-center">
                {/* Checkmark Icon */}
                <div className="flex justify-center mb-4">
                  <div className="
                    h-20 w-20
                    rounded-full
                    bg-gradient-to-br from-cyan-400/30 to-teal-400/30
                    flex items-center justify-center
                    ring-4 ring-cyan-400/20
                  ">
                    <Check className="h-10 w-10 text-cyan-300" strokeWidth={3} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  Testi suoritettu! Olet ottanut tärkeän askeleen kohti oman tulevaisuutesi pohtimista.
                </h2>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-slate-200/80 max-w-xl mx-auto">
                  Tulokset avautuvat hetken kuluttua.
                </p>
              </div>

              {/* Skip Button */}
              <button
                onClick={handleSkip}
                className="
                  absolute
                  bottom-4 right-4
                  px-4 py-2
                  text-xs font-medium
                  text-slate-400
                  hover:text-white
                  transition-colors
                  rounded-lg
                  hover:bg-white/5
                "
              >
                Ohita animaatio
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

