"use client";

import { useEffect, useState } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AboutUs from "@/components/AboutUs"
import { Logo } from "@/components/Logo"

export default function MeistaPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation - Blends with page background */}
      <nav
        className="sticky top-0 z-50 animate-fade-in-down border-b transition-all duration-300"
        style={{
          background: "transparent",
          backgroundColor: scrolled ? "rgba(11, 16, 21, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
          borderColor: scrolled ? "rgba(255, 255, 255, 0.1)" : "transparent",
        }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <Logo />
          <Button variant="outline" asChild className="border-urak-border/70 bg-urak-bg/70 hover:bg-urak-surface hover:border-urak-border">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <AboutUs />
      </main>
    </div>
  )
}
