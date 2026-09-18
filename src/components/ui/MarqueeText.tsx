'use client';

import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface MarqueeTextProps {
  items: React.ReactNode[];
  speed?: string;
  direction?: 'forward' | 'reverse';
}

export default function MarqueeText({ items, speed = 'slow', direction = 'forward' }: MarqueeTextProps) {
  // We'll rely on the Tailwind config animations for marquee
  const animationClass = direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'
  
  return (
    <div className="flex overflow-hidden relative w-full">
      <div className={twMerge("flex whitespace-nowrap", animationClass)}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-8">{item}</span>
            <span className="text-signal/30 text-sm">◆</span>
          </div>
        ))}
        {/* Duplicate items for seamless loop */}
        {items.map((item, index) => (
          <div key={`dup-${index}`} className="flex items-center">
            <span className="mx-8">{item}</span>
            <span className="text-signal/30 text-sm">◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}
