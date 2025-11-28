"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ArrowRight } from "lucide-react";

export default function CallToActionSection() {
  return (
    <AnimatedSection className="py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedCard className="bg-[#11161f] rounded-xl ring-1 ring-white/5 p-8 md:p-12 max-w-3xl mx-auto text-center shadow-[0_0_24px_rgba(0,0,0,0.25)] hover:bg-white/[0.03]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Valmiina tuntemaan itsesi?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Tunne itsesi ja löydä polkusi. Tee testi nyt ja saa henkilökohtaisia ohjauksia, jotka auttavat miettimään oman suuntasi.
          </p>
          <PrimaryButton href="/test" className="group inline-flex items-center gap-2 px-8 py-4 text-base">
            Aloita testi
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </PrimaryButton>
          <p className="text-xs sm:text-sm text-gray-400 mt-6">
            30 kysymystä • Maksuton • Tekoäly-powered
          </p>
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}
