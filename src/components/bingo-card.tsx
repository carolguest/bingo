"use client";

import { BingoCard as BingoCardType } from "@/lib/bingo-generator";
import { BingoPattern } from "@/lib/bingo-checker";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface BingoCardProps {
  card: BingoCardType;
  marked: boolean[][];
  winningPatterns: BingoPattern[];
  onSquareClick: (row: number, col: number) => void;
}

export function BingoCard({
  card,
  marked,
  winningPatterns,
  onSquareClick,
}: BingoCardProps) {
  const toSentenceCase = (phrase: string): string => {
    // Handle quoted phrases - capitalize first letter after opening quote
    if (phrase.startsWith('"')) {
      return '"' + phrase.charAt(1).toUpperCase() + phrase.slice(2);
    }
    // Regular sentence case
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  };

  const isWinningSquare = (row: number, col: number): boolean => {
    return winningPatterns.some((pattern) => {
      if (pattern.type === "row" && pattern.index === row) return true;
      if (pattern.type === "column" && pattern.index === col) return true;
      if (pattern.type === "diagonal") {
        if (pattern.direction === "top-left" && row === col) return true;
        if (pattern.direction === "top-right" && row + col === 4) return true;
      }
      return false;
    });
  };

  const createSparkle = (x: number, y: number) => {
    const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#fb7185'];
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${x}px;
        top: ${y}px;
      `;
      sparkle.classList.add('sparkle');
      document.body.appendChild(sparkle);
      
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 30 + Math.random() * 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      sparkle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      });
      
      setTimeout(() => sparkle.remove(), 600);
    }
  };

  const handleClick = (row: number, col: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (row === 2 && col === 2) return; // Center is always marked
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    if (!marked[row][col]) {
      createSparkle(x, y);
    }
    
    onSquareClick(row, col);
  };

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3 w-full max-w-md mx-auto">
      {card.map((row, rowIndex) =>
        row.map((phrase, colIndex) => {
          const isMarked = marked[rowIndex][colIndex];
          const isWinning = isWinningSquare(rowIndex, colIndex);
          const isCenter = rowIndex === 2 && colIndex === 2;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={(e) => handleClick(rowIndex, colIndex, e)}
              className={cn(
                "aspect-square border-2 rounded-lg p-2 md:p-2.5 transition-all relative overflow-hidden",
                "flex items-center justify-center",
                "touch-manipulation active:scale-95",
                "select-none",
                "break-words",
                isCenter
                  ? "bg-gradient-to-br from-fuchsia-500 to-pink-600 border-fuchsia-400 cursor-default"
                  : isMarked
                  ? "bg-white border-gray-200 hover:border-purple-200"
                  : "bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm",
                isWinning && "bingo-celebration bingo-glow"
              )}
              style={{
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              disabled={isCenter}
            >
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium text-center block leading-tight relative z-10",
                  isCenter || isMarked
                    ? "text-white"
                    : "text-gray-900"
                )}
              >
                {toSentenceCase(phrase)}
              </span>
              
              {isCenter && (
                <div className="absolute inset-0 opacity-10">
                  <Sparkles className="w-10 h-10 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" strokeWidth={1.5} />
                </div>
              )}
              
              {!isCenter && (
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-pink-600 transition-opacity duration-300",
                    isMarked ? "opacity-100" : "opacity-0"
                  )}
                />
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
