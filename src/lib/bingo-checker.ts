import { BingoCard } from "./bingo-generator";

export type BingoPattern = 
  | { type: "row"; index: number }
  | { type: "column"; index: number }
  | { type: "diagonal"; direction: "top-left" | "top-right" };

/**
 * Checks if a bingo pattern is complete (all squares marked)
 */
function isPatternComplete(
  card: BingoCard,
  marked: boolean[][],
  pattern: BingoPattern
): boolean {
  if (pattern.type === "row") {
    return marked[pattern.index].every((isMarked) => isMarked);
  }
  
  if (pattern.type === "column") {
    return marked.every((row) => row[pattern.index]);
  }
  
  if (pattern.type === "diagonal") {
    if (pattern.direction === "top-left") {
      // Top-left to bottom-right diagonal
      return marked.every((row, i) => row[i]);
    } else {
      // Top-right to bottom-left diagonal
      return marked.every((row, i) => row[4 - i]);
    }
  }
  
  return false;
}

/**
 * Checks for all completed bingo patterns (rows, columns, diagonals)
 * Returns array of winning patterns
 */
export function checkForBingo(
  card: BingoCard,
  marked: boolean[][]
): BingoPattern[] {
  const winningPatterns: BingoPattern[] = [];
  
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (isPatternComplete(card, marked, { type: "row", index: row })) {
      winningPatterns.push({ type: "row", index: row });
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    if (isPatternComplete(card, marked, { type: "column", index: col })) {
      winningPatterns.push({ type: "column", index: col });
    }
  }
  
  // Check diagonals
  if (isPatternComplete(card, marked, { type: "diagonal", direction: "top-left" })) {
    winningPatterns.push({ type: "diagonal", direction: "top-left" });
  }
  
  if (isPatternComplete(card, marked, { type: "diagonal", direction: "top-right" })) {
    winningPatterns.push({ type: "diagonal", direction: "top-right" });
  }
  
  return winningPatterns;
}

