'use client';

import React from 'react'
import CountUpRaw from 'react-countup'
import { useInView } from 'react-intersection-observer'

const CountUp = (CountUpRaw as any)?.default || CountUpRaw

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedCounter({ end, prefix = '', suffix = '', decimals = 0 }: AnimatedCounterProps) {
  const [ref, inView] = useInView({ triggerOnce: true })
  
  return (
    <span ref={ref}>
      {inView ? (
        <CountUp 
          start={0} 
          end={end} 
          duration={2.5} 
          prefix={prefix} 
          suffix={suffix} 
          decimals={decimals} 
        />
      ) : (
        <span>{prefix}0{suffix}</span>
      )}
    </span>
  )
}
