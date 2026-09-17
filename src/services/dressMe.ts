import { Garment } from '../types/wardrobe';
import { evaluateMatch } from './matchEngine';

export interface DressMeResult {
  top: Garment;
  bottom: Garment;
  topIndex: number;
  bottomIndex: number;
  score: number;
}

export function findMatchingOutfit(tops: Garment[], bottoms: Garment[]): DressMeResult | null {
  if (tops.length === 0 || bottoms.length === 0) return null;

  const validCombos: { top: Garment; bottom: Garment; topIndex: number; bottomIndex: number; score: number }[] = [];

  tops.forEach((top, tIdx) => {
    bottoms.forEach((bottom, bIdx) => {
      const verdict = evaluateMatch(top, bottom);
      if (verdict.status === 'MATCH') {
        validCombos.push({
          top,
          bottom,
          topIndex: tIdx,
          bottomIndex: bIdx,
          score: verdict.score,
        });
      }
    });
  });

  if (validCombos.length === 0) {
    // Fallback: pick any random combo
    const tIdx = Math.floor(Math.random() * tops.length);
    const bIdx = Math.floor(Math.random() * bottoms.length);
    return {
      top: tops[tIdx],
      bottom: bottoms[bIdx],
      topIndex: tIdx,
      bottomIndex: bIdx,
      score: 50,
    };
  }

  // Prefer high scores (iconic matches or scores >= 90)
  const highScoreCombos = validCombos.filter((c) => c.score >= 90);
  const pool = highScoreCombos.length > 0 ? highScoreCombos : validCombos;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  return picked;
}
