"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface GetStartedButtonProps {
  href?: string;
  text?: string;
  className?: string;
}

export function GetStartedButton({ 
  href = "/test", 
  text = "Aloita ilmainen testi",
  className = ""
}: GetStartedButtonProps) {
  return (
    <Button 
      asChild
      className={`group relative overflow-hidden ${className}`}
      size="lg"
    >
      <Link href={href} className="relative flex items-center justify-center">
        <span className="transition-opacity duration-500 group-hover:opacity-0 pr-8">
          {text}
        </span>
        <span className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-primary-foreground">
          <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </Link>
    </Button>
  );
}

