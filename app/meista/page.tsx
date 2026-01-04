"use client";

import ScrollNav from "@/components/ScrollNav"
import AboutUs from "@/components/AboutUs"

export default function MeistaPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <ScrollNav />

      {/* Main Content */}
      <main>
        <AboutUs />
      </main>
    </div>
  )
}
