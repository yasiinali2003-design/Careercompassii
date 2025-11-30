/**
 * LightRays Component
 * 
 * WebGL-based light rays effect using ogl.
 * Creates animated light rays that can follow mouse movement.
 */

"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { Renderer, Program, Triangle, Mesh, Vec2 } from 'ogl';
import './LightRays.css';

interface LightRaysProps {
  raysOrigin?: string;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (origin: string, w: number, h: number) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: new Vec2(0, -outside * h), dir: new Vec2(0, 1) };
    case 'top-right':
      return { anchor: new Vec2(w, -outside * h), dir: new Vec2(0, 1) };
    case 'left':
      return { anchor: new Vec2(-outside * w, 0.5 * h), dir: new Vec2(1, 0) };
    case 'right':
      return { anchor: new Vec2((1 + outside) * w, 0.5 * h), dir: new Vec2(-1, 0) };
    case 'bottom-left':
      return { anchor: new Vec2(0, (1 + outside) * h), dir: new Vec2(0, -1) };
    case 'bottom-center':
      return { anchor: new Vec2(0.5 * w, (1 + outside) * h), dir: new Vec2(0, -1) };
    case 'bottom-right':
      return { anchor: new Vec2(w, (1 + outside) * h), dir: new Vec2(0, -1) };
    default: // "top-center"
      return { anchor: new Vec2(0.5 * w, -outside * h), dir: new Vec2(0, 1) };
  }
};

const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

/* eslint-disable react/no-unescaped-entities */
const frag = `precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
varying vec2 vUv;
float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);
  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }
  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);
  fragColor = rays1 * 0.5 + rays2 * 0.4;
  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }
  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.6;
  fragColor.y *= 0.2 + brightness * 0.5;
  fragColor.z *= 0.3 + brightness * 0.4;
  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }
  fragColor.rgb *= raysColor * 0.6;
  fragColor.a *= 0.7;
}
void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;
/* eslint-enable react/no-unescaped-entities */

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 0.8,
  lightSpread = 0.9,
  rayLength = 1.4,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.15,
  noiseAmount = 0.07,
  distortion = 0.03,
  className = ''
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseRef = useRef<Vec2>(new Vec2(0.5, 0.5));
  const smoothMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const initializeWebGL = useCallback(async () => {
    if (!containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const container = containerRef.current;
    let rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
      rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn("LightRays: Container has no dimensions, skipping WebGL initialization.");
        return;
      }
    }

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;

    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vec2(rect.width, rect.height) },
      rayPos: { value: new Vec2(0, 0) },
      rayDir: { value: new Vec2(0, 1) },
      raysColor: { value: hexToRgb(raysColor) },
      raysSpeed: { value: raysSpeed },
      lightSpread: { value: lightSpread },
      rayLength: { value: rayLength },
      pulsating: { value: pulsating ? 1.0 : 0.0 },
      fadeDistance: { value: fadeDistance },
      saturation: { value: saturation },
      mousePos: { value: new Vec2(0.5, 0.5) },
      mouseInfluence: { value: mouseInfluence },
      noiseAmount: { value: noiseAmount },
      distortion: { value: distortion }
    };

    uniformsRef.current = uniforms;

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms
    });

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const updatePlacement = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const currentRenderer = rendererRef.current;
      currentRenderer.dpr = Math.min(window.devicePixelRatio, 2);
      const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
      currentRenderer.setSize(wCSS, hCSS);
      const dpr = currentRenderer.dpr;
      const w = wCSS * dpr;
      const h = hCSS * dpr;
      uniforms.iResolution.value.set(w, h);
      const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
      uniforms.rayPos.value.set(anchor.x, anchor.y);
      uniforms.rayDir.value.set(dir.x, dir.y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !followMouse) return;
      const currentRect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - currentRect.left) / currentRect.width;
      const y = (e.clientY - currentRect.top) / currentRect.height;
      mouseRef.current.set(x, y);
    };

    const loop = (t: number) => {
      if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
        return;
      }
      const currentRenderer = rendererRef.current;
      uniforms.iTime.value = t * 0.001;
      if (followMouse && mouseInfluence > 0.0) {
        const smoothing = 0.92;
        smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
        smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);
        uniforms.mousePos.value.set(smoothMouseRef.current.x, smoothMouseRef.current.y);
      }
      try {
        currentRenderer.render({ scene: mesh });
        animationIdRef.current = requestAnimationFrame(loop);
      } catch (error) {
        console.warn('WebGL rendering error:', error);
        return;
      }
    };

    window.addEventListener('resize', updatePlacement);
    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    updatePlacement();
    animationIdRef.current = requestAnimationFrame(loop);

    cleanupFunctionRef.current = () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      window.removeEventListener('resize', updatePlacement);
      if (followMouse) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (rendererRef.current) {
        try {
          const canvas = rendererRef.current.gl.canvas;
          const loseContextExt = rendererRef.current.gl.getExtension('WEBGL_lose_context');
          if (loseContextExt) {
            loseContextExt.loseContext();
          }
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        } catch (error) {
          console.warn('Error during WebGL cleanup:', error);
        }
      }
      rendererRef.current = null;
      uniformsRef.current = null;
      meshRef.current = null;
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    isVisible
  ]);

  useEffect(() => {
    if (isVisible && !rendererRef.current) {
      initializeWebGL();
    }
    return () => {
      if (!isVisible && cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [isVisible, initializeWebGL]);

  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return;
    const u = uniformsRef.current;
    const renderer = rendererRef.current;
    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;
    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    const dpr = renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr);
    u.rayPos.value.set(anchor.x, anchor.y);
    u.rayDir.value.set(dir.x, dir.y);
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  return <div ref={containerRef} className={`light-rays-container ${className}`.trim()} />;
}
