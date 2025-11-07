"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function CallToActionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const element = sectionRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div
          ref={sectionRef}
          className={`max-w-3xl mx-auto transition-opacity duration-1000 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Card className="bg-primary border-0 shadow-lg">
            <CardContent className="p-6 sm:p-12 text-center">
              <h2 
                className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-white"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
              >
                Valmiina tuntemaan itsesi?
              </h2>
              <p 
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white leading-relaxed"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
              >
                Tunne itsesi ja löydä polkusi. Tee testi nyt ja saa henkilökohtaisia ohjauksia, jotka auttavat miettimään oman suuntasi.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 font-semibold hover:scale-105 transition-transform bg-white text-primary hover:bg-white/90"
              >
                <Link href="/test">
                  Aloita testi
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <p 
                className="text-xs sm:text-sm text-white/80 mt-4"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
              >
                30 kysymystä • Maksuton • Tekoäly-powered
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
