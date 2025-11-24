"use client";

import Image from "next/image";
import { useState } from "react";

export default function LogoPreview() {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  const logos = [
    {
      name: "Full Compass Logo",
      file: "/logo.svg",
      size: "200×200px",
      use: "Primary logo, favicon, app icons",
      features: "Complete compass rose with N, S, E, W markers",
    },
    {
      name: "Simplified Icon",
      file: "/logo-icon.svg",
      size: "120×120px",
      use: "Small icons, favicons, mobile apps",
      features: "Minimal compass with N marker",
    },
    {
      name: "Logo + Text",
      file: "/logo-full.svg",
      size: "300×80px",
      use: "Header navigation, marketing",
      features: "Compass icon + 'Urakompassi' text",
    },
    {
      name: "Dark Background Version",
      file: "/logo-dark.svg",
      size: "200×200px",
      use: "Light/colored backgrounds",
      features: "Dark background with amber accents",
      darkBg: true,
    },
    {
      name: "Minimalist Logo",
      file: "/logo-simple.svg",
      size: "120×120px",
      use: "When minimal design needed",
      features: "Clean, simple compass",
    },
  ];

  const colors = [
    { name: "Primary", code: "#2B5F75", bg: "#2B5F75" },
    { name: "Secondary", code: "#E8994A", bg: "#E8994A" },
    { name: "Accent", code: "#4A7C59", bg: "#4A7C59" },
    { name: "Background", code: "#F8FAFB", bg: "#F8FAFB", border: true },
    { name: "Dark", code: "#1F4756", bg: "#1F4756" },
    { name: "Accent Red", code: "#D64545", bg: "#D64545" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFB] to-[#E8F2F5] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2B5F75] mb-2">
          Urakompassi Logo Collection
        </h1>
        <p className="text-lg text-[#5A6E7A] mb-10">
          Professional compass-based logo designs for your brand
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-[#2B5F75] mb-4">
                {logo.name}
              </h2>
              <div
                className={`bg-${logo.darkBg ? "[#1F4756]" : "[#F8FAFB]"} p-8 rounded-lg mb-4 flex items-center justify-center min-h-[200px]`}
                style={{
                  backgroundColor: logo.darkBg ? "#1F4756" : "#F8FAFB",
                }}
              >
                <img
                  src={logo.file}
                  alt={logo.name}
                  className="max-w-full h-auto cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedLogo(logo.file)}
                />
              </div>
              <div className="text-sm text-[#5A6E7A] space-y-1">
                <p>
                  <strong className="text-[#2B5F75]">File:</strong> {logo.file}
                </p>
                <p>
                  <strong className="text-[#2B5F75]">Size:</strong> {logo.size}
                </p>
                <p>
                  <strong className="text-[#2B5F75]">Use:</strong> {logo.use}
                </p>
                <p>
                  <strong className="text-[#2B5F75]">Features:</strong>{" "}
                  {logo.features}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-[#2B5F75] mb-6">
            Brand Colors
          </h2>
          <div className="flex flex-wrap gap-6">
            {colors.map((color, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="w-24 h-24 rounded-lg mb-2 shadow-md"
                  style={{
                    backgroundColor: color.bg,
                    border: color.border ? "1px solid #E0E0E0" : "none",
                  }}
                />
                <div className="text-sm font-semibold text-[#2B5F75]">
                  {color.name}
                </div>
                <div className="text-xs text-[#5A6E7A] font-mono">
                  {color.code}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#2B5F75] mb-4">
            Usage Guidelines
          </h2>
          <ul className="space-y-3 text-[#5A6E7A]">
            <li>
              <strong className="text-[#2B5F75]">Minimum Size:</strong> Logo
              should not be displayed smaller than 40px height
            </li>
            <li>
              <strong className="text-[#2B5F75]">Clear Space:</strong> Maintain
              at least 20% of logo height as clear space around it
            </li>
            <li>
              <strong className="text-[#2B5F75]">Background:</strong> Use
              logo-dark.svg on light/colored backgrounds
            </li>
            <li>
              <strong className="text-[#2B5F75]">Favicon:</strong> Use
              logo-icon.svg at 32×32px or 64×64px
            </li>
            <li>
              <strong className="text-[#2B5F75]">Print:</strong> Use SVG for
              scalability, or export PNG at 2x resolution
            </li>
            <li>
              <strong className="text-[#2B5F75]">Format:</strong> All logos are
              SVG format - scalable and editable
            </li>
          </ul>
        </div>

        {/* Modal for enlarged view */}
        {selectedLogo && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLogo(null)}
          >
            <div className="bg-white rounded-xl p-8 max-w-2xl">
              <img
                src={selectedLogo}
                alt="Enlarged logo"
                className="max-w-full h-auto"
              />
              <button
                onClick={() => setSelectedLogo(null)}
                className="mt-4 px-6 py-2 bg-[#2B5F75] text-white rounded-lg hover:bg-[#1F4756] transition-colors"
              >
                Sulje
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


