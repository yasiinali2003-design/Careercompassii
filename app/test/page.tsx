'use client';

import { useSearchParams } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CareerCompassTest from "@/components/CareerCompassTest"
import Logo from "@/components/Logo"

export default function TestPage() {
  const searchParams = useSearchParams();
  const pin = searchParams?.get('pin') || null;
  const classToken = searchParams?.get('classToken') || null;

  console.log('[TestPage] URL params:', { pin, classToken, allParams: searchParams?.toString() });

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin
            </Link>
          </Button>
        </div>
      </nav>

      {/* Test Component */}
      <CareerCompassTest pin={pin} classToken={classToken} />
    </div>
  )
}