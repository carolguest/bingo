"use client";

import { useState, useEffect, useCallback } from "react";
import { BingoCard } from "@/components/bingo-card";
import { BingoAnimation } from "@/components/bingo-animation";
import { Button } from "@/components/ui/button";
import { generateBingoCard, BingoCard as BingoCardType } from "@/lib/bingo-generator";
import { checkForBingo, BingoPattern } from "@/lib/bingo-checker";
import { Share2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [card, setCard] = useState<BingoCardType | null>(null);
  const [marked, setMarked] = useState<boolean[][]>(() => {
    // Initialize 5x5 grid, center is always marked
    const grid = Array(5)
      .fill(null)
      .map(() => Array(5).fill(false));
    grid[2][2] = true; // Center is FREE
    return grid;
  });
  const [winningPatterns, setWinningPatterns] = useState<BingoPattern[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Generate new card on mount
  useEffect(() => {
    generateNewCard();
  }, []);

  const generateNewCard = useCallback(() => {
    const newCard = generateBingoCard();
    setCard(newCard);
    // Reset marked squares (center is always marked)
    const newMarked = Array(5)
      .fill(null)
      .map(() => Array(5).fill(false));
    newMarked[2][2] = true; // Center is FREE
    setMarked(newMarked);
    setWinningPatterns([]);
    setHasWon(false);
    setShowAnimation(false);
  }, []);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      // Center square is always marked and can't be toggled
      if (row === 2 && col === 2) return;

      setMarked((prev) => {
        const newMarked = prev.map((r) => [...r]);
        newMarked[row][col] = !newMarked[row][col];
        return newMarked;
      });
    },
    []
  );

  // Check for bingo after marked squares change
  useEffect(() => {
    if (!card) return;

    const patterns = checkForBingo(card, marked);
    
    if (patterns.length > 0 && !hasWon) {
      setWinningPatterns(patterns);
      setHasWon(true);
      setShowAnimation(true);
      // Show toast after a short delay
      setTimeout(() => {
        toast.custom((t) => (
          <div
            onClick={() => toast.dismiss(t)}
            className={`bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 cursor-pointer transition-all ${
              t.visible ? 'animate-in slide-in-from-top-5' : 'animate-out slide-out-to-top-5'
            }`}
          >
            <span className="text-2xl">🦄✨</span>
            <span className="font-bold text-lg">BINGO!</span>
            <span className="text-2xl">✨🦄</span>
          </div>
        ), {
          duration: 5000,
        });
      }, 500);
    } else if (patterns.length === 0) {
      setWinningPatterns([]);
      setHasWon(false);
    }
  }, [marked, card, hasWon]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Thanksgiving Bingo",
        text: "Play Thanksgiving Bingo with me!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  }, []);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30 p-4 md:p-8">
      <Toaster />
      <BingoAnimation
        show={showAnimation}
        onComplete={() => setShowAnimation(false)}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-3">
            Thanksgiving Bingo
          </h1>
        </div>

        {/* Bingo Card */}
        <div className="mb-6">
          <BingoCard
            card={card}
            marked={marked}
            winningPatterns={winningPatterns}
            onSquareClick={handleSquareClick}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={generateNewCard}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg text-base font-medium hover:bg-purple-50 hover:border-purple-300 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
            <span>New Card</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg text-base font-medium hover:bg-purple-50 hover:border-purple-300 transition-all active:scale-95 shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </main>
  );
}
