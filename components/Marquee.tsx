import React from 'react';
import { PortfolioSettings, DEFAULT_MARQUEE_ITEMS } from '@/lib/types';

interface MarqueeProps {
  settings?: PortfolioSettings | null;
  items?: string[];
}

export default function Marquee({ settings, items }: MarqueeProps) {
  const stack =
    items && items.length > 0
      ? items
      : settings?.marqueeItems && settings.marqueeItems.length > 0
      ? settings.marqueeItems
      : DEFAULT_MARQUEE_ITEMS;

  return (
    <div className="marquee-wrapper" aria-label="Technology Stack Marquee">
      <div className="marquee">
        {stack.map((item, idx) => (
          <span key={`m1-${idx}`}>{item}</span>
        ))}
        {stack.map((item, idx) => (
          <span key={`m2-${idx}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
