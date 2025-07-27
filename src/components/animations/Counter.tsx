'use client';
import React, { useState, useEffect } from "react";

interface CounterProps {
  targetValue: number | string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ targetValue, duration = 2000 }) => {
  const [count, setCount] = useState<number>(0);
  const [suffix, setSuffix] = useState<string>("");

  useEffect(() => {
    let end: number;
    let displaySuffix: string = "";

    // Parse targetValue
    if (typeof targetValue === "string") {
      // Remove commas and split on non-numeric characters to separate number and suffix
      const cleanValue = targetValue.replace(/,/g, "");
      const splitValue = cleanValue.split(/(\d+)/).filter(Boolean);
      end = parseInt(splitValue[0]);
      displaySuffix = splitValue[1] || ""; // Capture suffix like "+" or empty string
    } else {
      end = parseInt(targetValue.toString());
      displaySuffix = "";
    }

    if (end === 0) {
      setCount(0);
      setSuffix(displaySuffix);
      return;
    }

    // Calculate increment steps
    const incrementTime = Math.max(16, duration / end); // Ensure at least 16ms per frame (~60fps)
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = Math.min(current / (duration / incrementTime), 1); // Normalize progress
      const nextValue = Math.round(progress * end);
      setCount(nextValue);
      setSuffix(displaySuffix);

      if (progress >= 1) {
        // Ensure exact end value with proper formatting
        const formattedValue = typeof targetValue === "string"
          ? parseInt(targetValue.replace(/,/g, "")).toLocaleString()
          : end.toLocaleString();
        setCount(parseInt(formattedValue.replace(/,/g, "")));
        setSuffix(displaySuffix);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return (
    <h3 className="font-semibold">
      {count.toLocaleString()}{suffix}
    </h3>
  );
};

export default Counter;