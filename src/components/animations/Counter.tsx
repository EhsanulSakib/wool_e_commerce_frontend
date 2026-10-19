'use client';
import { useEffect, useState } from 'react';

// Temporary counter; replaced by the CountUp motion component in module 07.

interface CounterProps {
  targetValue: number | string;
  duration?: number;
}

/** "30,000+" → { end: 30000, suffix: "+" } */
function parseTarget(targetValue: number | string) {
  if (typeof targetValue === 'number') return { end: targetValue, suffix: '' };
  const match = targetValue.replace(/,/g, '').match(/^(\d+)(.*)$/);
  return match
    ? { end: Number(match[1]), suffix: match[2] ?? '' }
    : { end: 0, suffix: '' };
}

const Counter = ({ targetValue, duration = 2000 }: CounterProps) => {
  const { end, suffix } = parseTarget(targetValue);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) return;

    const startedAt = performance.now();
    const timer = setInterval(() => {
      const progress = Math.min((performance.now() - startedAt) / duration, 1);
      setCount(Math.round(progress * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className="block text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default Counter;
