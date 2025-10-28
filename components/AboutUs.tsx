"use client";

import React, { useEffect, useState, useRef } from "react";

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

// AnimatedSection Component for scroll animations
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// MissionIntro Component
const MissionIntro = () => (
  <AnimatedSection>
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Missiomme
      </h2>
      <div className="space-y-4 max-w-prose">
        <p className="text-[#334155] leading-relaxed text-lg">
          CareerCompassin tehtävänä on auttaa nuoria tunnistamaan vahvuutensa ja löytämään oman suuntansa, sellaisen, joka tuntuu aidosti omalta.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Uskomme, että jokaisella on potentiaali rakentaa merkityksellinen tulevaisuus. Tarvitaan vain oikea kompassi näyttämään tie eteenpäin.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Rakennamme tulevaisuutta, jossa jokaisella nuorella on mahdollisuus löytää oma polkunsa helposti, yksilöllisesti ja motivoivasti.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Autamme säästämään aikaa, tekemään rohkeita päätöksiä ja rakentamaan uraa ilman painetta tai epävarmuutta.
        </p>
      </div>
    </div>
  </AnimatedSection>
);

// MissionSection Component
const MissionSection = () => (
  <AnimatedSection>
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Meidän tehtävämme
      </h2>
      <div className="space-y-4 max-w-prose">
        <p className="text-[#334155] leading-relaxed text-lg">
          Rakennamme tulevaisuutta, jossa jokaisella nuorella on mahdollisuus löytää oma polkunsa helposti, yksilöllisesti ja motivoivasti.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Autamme nuoria säästämään aikaa, tekemään rohkeita päätöksiä ja rakentamaan uraa, joka tuntuu omalta ilman painetta tai epävarmuutta.
        </p>
      </div>
    </div>
  </AnimatedSection>
);

// ApproachSection Component
const ApproachSection = () => (
  <AnimatedSection>
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Lähestymistapamme
      </h2>
      <div className="space-y-4 max-w-prose">
        <p className="text-[#334155] leading-relaxed text-lg">
          Yhdistämme tekoälyn ja empatian.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          CareerCompassi hyödyntää dataa ja modernia teknologiaa, mutta säilyttää aina inhimillisen näkökulman.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Tekoäly analysoi vastauksia vertaamalla niitä tuhansiin uraprofiileihin ja löytää koulutuspolkuja, jotka vastaavat käyttäjän arvoja, kiinnostuksia ja vahvuuksia.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Uskomme, että kun ymmärtää itseään paremmin, löytyy myös suunta, joka vie kohti merkityksellisempää elämää.
        </p>
      </div>
    </div>
  </AnimatedSection>
);

// Meistä Section Component
const MeistSection = () => (
  <AnimatedSection>
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Meistä
      </h2>
      <div className="space-y-4 max-w-prose">
        <p className="text-[#334155] leading-relaxed text-lg">
          Olemme kolme 22-vuotiasta, jotka sekä opiskelevat että työskentelevät. Elämme siis samaa todellisuutta kuin ne nuoret, joita haluamme auttaa.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Olemme itse kokeneet, kuinka vaikeaa on löytää oma suunta ilman selkeää ohjausta ja kuinka paljon aikaa kuluu tietoa etsiessä eri aloista.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Olemme nähneet läheltä, kuinka monet ystävämme lähtivät opiskelemaan hyväksynnän tunteen tai sosiaalisen paineen vuoksi, eivät aidosta kiinnostuksesta.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Kasvoimme alueella, jossa on paljon maahanmuuttajataustaisia nuoria, joilla ei aina ole tukea tai tietoa suomalaisesta koulutusjärjestelmästä.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Haluamme tarjota heille saman mahdollisuuden löytää oman polkunsa ja rakentaa tulevaisuuden, joka tuntuu omalta.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          CareerCompassin taustalla on aito halu ratkaista ongelma, jonka olemme itse kokeneet.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          Meidän vahvuutemme on syvä ymmärrys kohderyhmästä, motivaatio tehdä yhteiskunnallisesti merkittävää työtä ja into rakentaa ratkaisu, joka on sekä inhimillinen että teknisesti kehittynyt.
        </p>
      </div>
    </div>
  </AnimatedSection>
);

// Contact Section Component
const ContactSection = () => (
  <AnimatedSection>
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
        Yhteystiedot
      </h2>
      <div className="space-y-4 max-w-prose">
        <p className="text-[#334155] leading-relaxed text-lg">
          <strong>Sähköposti:</strong> support@careercompassi.fi
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          <strong>Yhteistyö kouluille ja opettajille:</strong> Ota yhteyttä, jos haluat tuoda CareerCompassin osaksi opetusta tai opiskelijapalveluita.
        </p>
        <p className="text-[#334155] leading-relaxed text-lg">
          <strong>Verkkosivut:</strong> careercompassi.com
        </p>
      </div>
    </div>
  </AnimatedSection>
);

// Main AboutUs Component
const AboutUs = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#E8EEFF] to-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
      {/* Compass Background */}
      <CompassBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main Missio Title */}
        <div className="text-center mb-12">
          <h1 
            className="font-bold text-[#2563EB] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)' }}
          >
            Meistä
          </h1>
          {/* Optional gradient line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent mx-auto"></div>
        </div>
        
        {/* Mission Content */}
        <div className="space-y-12">
          <MissionIntro />
          <ApproachSection />
          <MeistSection />
          <ContactSection />
        </div>
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