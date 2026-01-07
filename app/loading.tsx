"use client";
import gsap from "gsap";
import React, { useRef, useEffect } from "react";

function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const bars = containerRef.current.children;

    Array.from(bars).forEach((bar, index) => {
      gsap.fromTo(
        bar,
        {
          scaleY: 0.4,
        },
        {
          scaleY: 1.6,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          delay: index * 0.1,
          ease: "sine.inOut",
        }
      );
    });

    return () => {
      gsap.killTweensOf(bars);
    };
  }, []);

  return (
    <div className="flex-center h-screen w-full">
      <div ref={containerRef} className="flex gap-2">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-2 h-12 bg-[linear-gradient(180deg,#00cec9,#6c5ce7)]"
            ></div>
          ))}
      </div>
    </div>
  );
}

export default Loading;
