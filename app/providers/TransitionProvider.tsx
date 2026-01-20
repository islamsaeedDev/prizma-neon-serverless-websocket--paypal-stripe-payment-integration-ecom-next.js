"use client";

import gsap from "gsap";
import { TransitionRouter } from "next-transition-router";
import React, { useEffect, useRef } from "react";

const BLOCK_SIZE = 60;

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const transitionRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement[]>([]);

  const createTransitionGrid = () => {
    if (!transitionRef.current) return;

    const container = transitionRef.current;
    container.innerHTML = "";
    blockRef.current = [];

    const gridWidth = window.innerWidth;
    const gridHeight = window.innerHeight;

    const columns = Math.ceil(gridWidth / BLOCK_SIZE);
    const rows = Math.ceil(gridHeight / BLOCK_SIZE);

    const offsetX = (gridWidth - columns * BLOCK_SIZE) / 2;
    const offsetY = (gridHeight - rows * BLOCK_SIZE) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const block = document.createElement("div");
        block.className = "transition-block";
        block.style.cssText = `
        width:${BLOCK_SIZE}px;
        height:${BLOCK_SIZE}px;
        left:${col * BLOCK_SIZE + offsetX}px;
        top:${row * BLOCK_SIZE + offsetY}px;
        `;
        container.appendChild(block);
        blockRef.current.push(block);
      }
    }
    gsap.set(blockRef.current, {
      transformOrigin: "center center",
      opacity: 0,
    });
  };

  useEffect(() => {
    createTransitionGrid();
    window.addEventListener("resize", createTransitionGrid);
    return () => {
      window.removeEventListener("resize", createTransitionGrid);
    };
  }, []);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tween = gsap.to(blockRef.current, {
          opacity: 1,
          duration: 0.05,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
      enter={(next) => {
        gsap.set(blockRef.current, {
          opacity: 1,
        });
        const tween = gsap.to(blockRef.current, {
          opacity: 0,
          duration: 0.05,
          ease: "power2.out",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
    >
      <div className="transition-grid" ref={transitionRef} />
      {children}
    </TransitionRouter>
  );
};

export default TransitionProvider;
