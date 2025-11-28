"use client";

import { useEffect } from "react";

interface BingoAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function BingoAnimation({ show, onComplete }: BingoAnimationProps) {
  useEffect(() => {
    if (show) {
      createConfetti();
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return null;
}

function createConfetti() {
  const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#fb7185', '#fbbf24', '#34d399'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      confetti.style.animationDelay = (Math.random() * 0.5) + 's';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
}
