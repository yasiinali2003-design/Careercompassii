import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-urak-bg text-urak-text-primary">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-urak-accent-blue/10 blur-3xl" />
        <div className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-urak-accent-green/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navbar goes here */}
        {children}
        {/* Footer goes here */}
      </div>
    </div>
  );
}










