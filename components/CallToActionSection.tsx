"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/GetStartedButton";
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
          <Card className="bg-gradient-to-br from-[#1f2937] to-[#020617] border border-[#242938] shadow-2xl hover:shadow-[#2B5F75]/20 hover:border-[#2B5F75]/50 transition-all duration-500">
            <CardContent className="p-6 sm:p-12 text-center relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B5F75]/10 via-transparent to-[#4A7C59]/10 pointer-events-none"></div>

              <div className="relative z-10">
                <h2
                  className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-white"
                >
                  Valmiina tuntemaan itsesi?
                </h2>
                <p
                  className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300 leading-relaxed"
                >
                  Tunne itsesi ja löydä polkusi. Tee testi nyt ja saa henkilökohtaisia ohjauksia, jotka auttavat miettimään oman suuntasi.
                </p>
                <GetStartedButton
                  href="/test"
                  text="Aloita testi"
                  className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 font-semibold bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                />
                <p
                  className="text-xs sm:text-sm text-gray-400 mt-4"
                >
                  30 kysymystä • Maksuton • Tekoäly-powered
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
