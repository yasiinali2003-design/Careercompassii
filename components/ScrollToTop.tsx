"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Always scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
    
    // Also scroll body to top (in case body is scrollable)
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Ensure snap scroll is removed when navigating away from home page
    const htmlElement = document.documentElement;
    if (pathname !== "/") {
      htmlElement.style.scrollSnapType = '';
    }
  }, [pathname]);

  return null;
}

