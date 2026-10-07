"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const fullPath = searchParams && searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Prevent duplicate firing on same path
    if (lastTrackedPathRef.current === fullPath) {
      return;
    }

    lastTrackedPathRef.current = fullPath;

    // Capture client environment metadata
    const screenResolution = typeof window !== 'undefined'
      ? `${window.screen.width}x${window.screen.height}`
      : 'Unknown';
    const referrer = typeof document !== 'undefined' && document.referrer
      ? document.referrer
      : 'Direct';
    const language = typeof navigator !== 'undefined'
      ? navigator.language
      : 'en';

    // Dispatch background analytics ping
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: fullPath,
        referrer,
        screenResolution,
        language,
      }),
      // Use keepalive for reliability on navigation
      keepalive: true,
    }).catch(() => {
      // Ignore background tracking failure
    });
  }, [pathname, searchParams]);

  return null;
}
