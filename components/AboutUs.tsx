"use client";

import React, { useEffect, useState } from "react";

// CompassBackground Component - SVG compass with subtle animation
const CompassBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      if (!prefersReducedMotion) {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 12, // Max 12px parallax
          y: (e.clientY / window.innerHeight - 0.5) * 12,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <>
      {/* Desktop Compass */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 opacity-12 pointer-events-none hidden md:block"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: prefersReducedMotion ? "none" : "transform 0.1s ease-out",
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="#1E6F73"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Inner circle */}
          <circle
            cx="200"
            cy="200"
            r="120"
            stroke="#1E6F73"
            strokeWidth="0.5"
            opacity="0.2"
          />
          
          {/* Cardinal directions */}
          <line
            x1="200"
            y1="20"
            x2="200"
            y2="380"
            stroke="#1E6F73"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1="20"
            y1="200"
            x2="380"
            y2="200"
            stroke="#1E6F73"
            strokeWidth="1"
            opacity="0.4"
          />
          
          {/* Diagonal lines */}
          <line
            x1="141.4"
            y1="141.4"
            x2="258.6"
            y2="258.6"
            stroke="#1E6F73"
            strokeWidth="0.5"
            opacity="0.2"
          />
          <line
            x1="258.6"
            y1="141.4"
            x2="141.4"
            y2="258.6"
            stroke="#1E6F73"
            strokeWidth="0.5"
            opacity="0.2"
          />
          
          {/* Compass needle */}
          <g opacity="0.6">
            <path
              d="M200 200 L200 60 L195 70 L200 200 Z"
              fill="#1E6F73"
            />
            <path
              d="M200 200 L200 60 L205 70 L200 200 Z"
              fill="#1E6F73"
            />
          </g>
          
          {/* Center dot */}
          <circle
            cx="200"
            cy="200"
            r="3"
            fill="#1E6F73"
            opacity="0.5"
          />
          
          {/* Degree markers */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const x1 = 200 + Math.cos(angle) * 160;
            const y1 = 200 + Math.sin(angle) * 160;
            const x2 = 200 + Math.cos(angle) * 170;
            const y2 = 200 + Math.sin(angle) * 170;
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1E6F73"
                strokeWidth="0.5"
                opacity="0.15"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Mobile Compass - Simplified */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 opacity-8 pointer-events-none md:hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified mobile compass - only cardinal directions */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="#1E6F73"
            strokeWidth="1"
            opacity="0.2"
          />
          
          {/* Cardinal directions only */}
          <line
            x1="100"
            y1="20"
            x2="100"
            y2="180"
            stroke="#1E6F73"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="20"
            y1="100"
            x2="180"
            y2="100"
            stroke="#1E6F73"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Simple needle */}
          <path
            d="M100 100 L100 30 L95 40 L100 100 Z"
            fill="#1E6F73"
            opacity="0.4"
          />
          
          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="2"
            fill="#1E6F73"
            opacity="0.4"
          />
        </svg>
      </div>
    </>
  );
};

// AboutHero Component
const AboutHero = () => (
  <div className="mb-12">
    <p className="text-slate-500 text-sm font-medium mb-4 tracking-wide uppercase">
      Kolme nuorta, yksi yhteinen tavoite: auttaa muita löytämään oman suunnan.
    </p>
    <p className="text-slate-700 text-lg leading-relaxed max-w-prose">
      Me ollaan kolme 22-vuotiasta, jotka sekä opiskelevat että työskentelevät. Me ymmärretään, miltä tuntuu kun pitää tehdä isoja päätöksiä tulevaisuudesta ilman selkeää suuntaa.
    </p>
  </div>
);

// WhySection Component
const WhySection = () => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
      Miksi loimme CareerCompassin?
    </h2>
    <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100">
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1E6F73] mt-2 flex-shrink-0" />
          <span className="text-slate-700 leading-relaxed">
            Monet nuoret joutuvat tekemään suuria tulevaisuuspäätöksiä ilman riittävää tukea tai tietoa
          </span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1E6F73] mt-2 flex-shrink-0" />
          <span className="text-slate-700 leading-relaxed">
            Koulun uraohjaus on rajallista, eikä opettajilla ole aina aikaa antaa jokaiselle henkilökohtaista apua
          </span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1E6F73] mt-2 flex-shrink-0" />
          <span className="text-slate-700 leading-relaxed">
            Olemme nähneet, kuinka kaverit valitsevat opintoja tai uria sosiaalisen hyväksynnän tai paineen vuoksi – ei aidosta intohimosta
          </span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1E6F73] mt-2 flex-shrink-0" />
          <span className="text-slate-700 leading-relaxed">
            Kasvoimme alueella, jossa on paljon maahanmuuttajataustaisia nuoria, ja haluamme tarjota heille samat mahdollisuudet löytää oma polkunsa
          </span>
        </li>
      </ul>
    </div>
  </div>
);

// MissionSection Component
const MissionSection = () => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
      Meidän tehtävämme
    </h2>
    <div className="space-y-4 max-w-prose">
      <p className="text-slate-700 leading-relaxed">
        Rakennamme tulevaisuutta, jossa jokaisella nuorella on mahdollisuus löytää oma suuntansa – helposti, yksilöllisesti ja motivoivasti.
      </p>
      <p className="text-slate-700 leading-relaxed">
        Haluamme auttaa nuoria säästämään aikaa, välttämään turhia virheitä ja löytämään oman polkunsa – ilman painetta tai epävarmuutta.
      </p>
    </div>
  </div>
);

// ApproachSection Component
const ApproachSection = () => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-slate-900 mb-4 tracking-tight">
      Lähestymistapamme
    </h3>
    <p className="text-slate-700 leading-relaxed max-w-prose">
      Meidän lähestymistapamme yhdistää teknologian ja empatian. CareerCompassi käyttää tekoälyä ja dataa, mutta pysyy aina ihmiskeskeisenä. Me uskomme, että oikea suunta löytyy, kun ymmärtää itsensä paremmin.
    </p>
  </div>
);

// Main AboutUs Component
const AboutUs = () => {
  return (
    <section className="relative bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
      {/* Compass Background */}
      <CompassBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <AboutHero />
        <WhySection />
        <MissionSection />
        <ApproachSection />
      </div>
    </section>
  );
};

export default AboutUs;

/* 
DESIGN NOTES & CUSTOMIZATION:

1. COMPASS OPACITY: Adjust the opacity class on CompassBackground (currently "opacity-12")
   - Range: opacity-10 (0.1) to opacity-18 (0.18)
   - Current: opacity-12 = 0.12

2. ACCENT COLOR: Change #1E6F73 throughout the component
   - Alternative: #1C3B5A (navy)
   - Search for "#1E6F73" and replace with your chosen color

3. MOTION SPEED: Adjust parallax intensity
   - Current: max 12px movement
   - Change the multiplier in setMousePosition (currently * 12)

4. COMPASS SIZE: Modify the container dimensions
   - Current: w-96 h-96 (384px)
   - Adjust: w-80 h-80 (smaller) or w-[28rem] h-[28rem] (larger)

5. POSITIONING: Change compass placement
   - Current: -top-24 -right-24
   - Alternatives: -top-16 -left-16, -bottom-24 -right-24, etc.

6. REDUCED MOTION: Automatically respects prefers-reduced-motion
   - No additional configuration needed
   - Animation disabled when user prefers reduced motion
*/
