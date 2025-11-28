import { THANKSGIVING_PHRASES } from "@/data/phrases";

export type BingoCard = string[][];

const GRID_SIZE = 5;
const CENTER_INDEX = 2; // 0-indexed, so center is [2][2]

/**
 * Generates a random 5x5 bingo card from the phrase pool
 * Center square is always "FREE"
 * No duplicate phrases per card
 */
export function generateBingoCard(): BingoCard {
  // Create a shuffled copy of all phrases
  const shuffled = [...THANKSGIVING_PHRASES].sort(() => Math.random() - 0.5);
  
  // We need 24 phrases (5x5 = 25, minus 1 for center)
  const selectedPhrases = shuffled.slice(0, 24);
  
  // Create 5x5 grid
  const card: BingoCard = [];
  let phraseIndex = 0;
  
  for (let row = 0; row < GRID_SIZE; row++) {
    const cardRow: string[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      if (row === CENTER_INDEX && col === CENTER_INDEX) {
        // Center square is FREE
        cardRow.push("FREE");
      } else {
        cardRow.push(selectedPhrases[phraseIndex]);
        phraseIndex++;
      }
    }
    card.push(cardRow);
  }
  
  return card;
}

