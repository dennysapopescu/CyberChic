import { Garment, GarmentStyle, GarmentSeason, MatchVerdict } from '../types/wardrobe';

/**
 * Color utilities: RGB and HSL conversions for dynamic color harmony calculations.
 */
interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 1
  l: number; // 0 - 1
}

function parseHexToHsl(hex: string): HSL {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleanHex.length !== 6) {
    // Default fallback neutral charcoal
    return { h: 0, s: 0, l: 0.2 };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s, l };
}

/**
 * Determines if a color acts as a fashion neutral.
 * Neutrals (black, white, ivory, gray, denim blue, khaki/camel) pair with practically any color.
 */
function isNeutral(hsl: HSL, pattern?: string): boolean {
  // True black or deep charcoal
  if (hsl.l <= 0.18) return true;
  // True white or cream / ivory
  if (hsl.l >= 0.86) return true;
  // Desaturated grays
  if (hsl.s <= 0.16) return true;
  // Denim texture
  if (pattern === 'denim') return true;
  // Navy / denim hue with muted saturation
  if (hsl.h >= 200 && hsl.h <= 245 && hsl.s <= 0.55 && hsl.l <= 0.45) return true;
  // Beige / camel / khaki
  if (hsl.h >= 25 && hsl.h <= 55 && hsl.s <= 0.45 && hsl.l >= 0.45 && hsl.l <= 0.85) return true;

  return false;
}

/**
 * Computes color harmony between any two garments using color theory principles:
 * - Neutral anchoring
 * - Monochromatic / tonal alignment
 * - Analogous harmony
 * - Complementary balance
 * - Primary clash detection
 */
function evaluateColorHarmony(
  top: Garment,
  bottom: Garment
): { score: number; description: string; isClash: boolean } {
  const topHsl = parseHexToHsl(top.color);
  const bottomHsl = parseHexToHsl(bottom.color);

  const topNeutral = isNeutral(topHsl, top.pattern);
  const bottomNeutral = isNeutral(bottomHsl, bottom.pattern);

  // Both are neutrals: crisp, statuesque monochromatic contrast
  if (topNeutral && bottomNeutral) {
    return {
      score: 95,
      description: 'Timeless neutral-on-neutral contrast creating crisp, statuesque lines.',
      isClash: false,
    };
  }

  // One neutral + one accent: foundational fashion rule
  if (topNeutral || bottomNeutral) {
    const accentPiece = topNeutral ? bottom : top;
    return {
      score: 94,
      description: `Bold ${accentPiece.colorName.toLowerCase()} anchored by a grounding neutral base.`,
      isClash: false,
    };
  }

  // Both are non-neutral colors: analyze angular hue relationship
  const hueDiff = Math.min(
    Math.abs(topHsl.h - bottomHsl.h),
    360 - Math.abs(topHsl.h - bottomHsl.h)
  );

  // Severe Primary Clash: Saturated Red + Saturated Yellow/Green
  const isRed = (topHsl.h >= 340 || topHsl.h <= 20) && topHsl.s > 0.55;
  const isYellow = bottomHsl.h >= 40 && bottomHsl.h <= 65 && bottomHsl.s > 0.6;
  const isRedBottom = (bottomHsl.h >= 340 || bottomHsl.h <= 20) && bottomHsl.s > 0.55;
  const isYellowTop = topHsl.h >= 40 && topHsl.h <= 65 && topHsl.s > 0.6;

  if ((isRed && isYellow) || (isRedBottom && isYellowTop)) {
    return {
      score: 22,
      description: 'Clashing saturated primary tones competing loudly for visual dominance.',
      isClash: true,
    };
  }

  // Monochromatic / Tone-on-tone (delta Hue <= 25)
  if (hueDiff <= 25) {
    const lightnessDiff = Math.abs(topHsl.l - bottomHsl.l);
    if (lightnessDiff >= 0.15) {
      return {
        score: 93,
        description: 'Sophisticated tonal monochrome with nuanced depth and shade layering.',
        isClash: false,
      };
    }
    return {
      score: 89,
      description: 'Harmonious tone-on-tone palette.',
      isClash: false,
    };
  }

  // Analogous Harmony (neighboring colors on color wheel: 25 - 60 deg)
  if (hueDiff <= 65) {
    return {
      score: 90,
      description: 'Organic analogous color flow that pleases the eye effortlessly.',
      isClash: false,
    };
  }

  // Complementary Energy (opposite colors: 150 - 210 deg)
  if (hueDiff >= 145 && hueDiff <= 215) {
    // Check if one has moderate saturation so it isn't an eye strain
    if (topHsl.s < 0.8 || bottomHsl.s < 0.8) {
      return {
        score: 88,
        description: 'Vibrant complementary pop creating exciting runway contrast.',
        isClash: false,
      };
    }
    return {
      score: 72,
      description: 'High-contrast complementary pairing with intense saturation.',
      isClash: false,
    };
  }

  // Triadic / Soft Harmony (100 - 140 deg)
  if (hueDiff >= 100 && hueDiff <= 140) {
    return {
      score: 83,
      description: 'Dynamic balanced triadic color relationship.',
      isClash: false,
    };
  }

  // Moderate color pairing
  return {
    score: 70,
    description: 'Eclectic color combination with moderate visual synergy.',
    isClash: false,
  };
}

/**
 * Evaluates pattern compatibility:
 * - Statement print + solid neutral is highest tier
 * - Conflicting prints (plaid on plaid with different schemes) is penalized
 */
function evaluatePatternHarmony(
  top: Garment,
  bottom: Garment
): { score: number; description: string; isClash: boolean } {
  // Plaid on Plaid without same suit set
  if (top.pattern === 'plaid' && bottom.pattern === 'plaid') {
    if (top.color === bottom.color && top.suitSetId === bottom.suitSetId) {
      return {
        score: 100,
        description: 'Cohesive matching tartan coordinate set.',
        isClash: false,
      };
    }
    return {
      score: 15,
      description: 'Conflicting tartan geometries creating severe visual chaos.',
      isClash: true,
    };
  }

  // Print + Print Clash (e.g. plaid + floral, striped + argyle)
  const isTopPrint = top.pattern !== 'solid' && top.pattern !== 'denim';
  const isBottomPrint = bottom.pattern !== 'solid' && bottom.pattern !== 'denim';

  if (isTopPrint && isBottomPrint) {
    if (top.pattern === bottom.pattern && top.color === bottom.color) {
      return {
        score: 94,
        description: 'Unified all-over print matching across garments.',
        isClash: false,
      };
    }
    return {
      score: 25,
      description: 'Two conflicting complex patterns fighting for attention without a visual rest.',
      isClash: true,
    };
  }

  // Hero Pattern + Solid Grounding Piece (Fashion's #1 Rule)
  if ((isTopPrint && !isBottomPrint) || (!isTopPrint && isBottomPrint)) {
    const printPattern = isTopPrint ? top.pattern : bottom.pattern;
    return {
      score: 95,
      description: `The bold ${printPattern} statement piece is anchored cleanly by a smooth solid ground.`,
      isClash: false,
    };
  }

  // Texture bonus: Metallic or Denim pairing
  if (top.pattern === 'metallic' || bottom.pattern === 'metallic') {
    return {
      score: 91,
      description: 'Luminous texture contrast that feels decadent and modern.',
      isClash: false,
    };
  }

  // Solid on Solid
  return {
    score: 88,
    description: 'Clean minimalist silhouette without pattern distraction.',
    isClash: false,
  };
}

/**
 * Formality and style synergy matrix:
 * Rates compatibility between fashion genres (School, Chic, Party, Casual, Grunge).
 */
function evaluateStyleHarmony(
  style1: GarmentStyle,
  style2: GarmentStyle
): { score: number; description: string; isClash: boolean } {
  if (style1 === style2) {
    return {
      score: 96,
      description: `Complete aesthetic cohesion in ${style1.toLowerCase()} styling.`,
      isClash: false,
    };
  }

  const pairKey = [style1, style2].sort().join('-');

  switch (pairKey) {
    case 'Chic-School':
      return {
        score: 93,
        description: 'Beverly Hills preppy elegance meets runway chic.',
        isClash: false,
      };
    case 'Chic-Party':
      return {
        score: 92,
        description: 'Sophisticated glamour ready for evening festivities.',
        isClash: false,
      };
    case 'Casual-School':
      return {
        score: 87,
        description: 'Relaxed collegiate daytime fashion.',
        isClash: false,
      };
    case 'Casual-Grunge':
      return {
        score: 88,
        description: 'Authentic 90s laid-back off-duty aesthetic.',
        isClash: false,
      };
    case 'Casual-Chic':
      return {
        score: 82,
        description: 'High-low fashion mix pairing polished chic with relaxed staples.',
        isClash: false,
      };
    case 'Grunge-School':
      return {
        score: 68,
        description: 'Alternative subculture twist on classic uniform cuts.',
        isClash: false,
      };
    case 'Party-School':
      return {
        score: 55,
        description: 'Noticeable formality friction between formal partywear and daywear.',
        isClash: false,
      };
    case 'Casual-Party':
      return {
        score: 35,
        description: 'Extreme formality clash: evening partywear mixed with slouchy casual.',
        isClash: true,
      };
    case 'Chic-Grunge':
      return {
        score: 42,
        description: 'Dissonant style moods between sleek tailored elegance and raw grunge.',
        isClash: true,
      };
    case 'Grunge-Party':
      return {
        score: 22,
        description: 'Severe formality contradiction between evening cocktail couture and distressed grunge.',
        isClash: true,
      };
    default:
      return {
        score: 75,
        description: 'Eclectic style crossing different fashion genres.',
        isClash: false,
      };
  }
}

/**
 * Seasonal weight and temperature coherence.
 */
function evaluateSeasonHarmony(
  s1: GarmentSeason,
  s2: GarmentSeason
): { score: number; description: string } {
  if (s1 === s2 || s1 === 'All' || s2 === 'All') {
    return { score: 95, description: 'Seamless seasonal coherence.' };
  }

  // Adjacent seasons
  const isAdjacent =
    (s1 === 'Spring' && s2 === 'Summer') ||
    (s1 === 'Summer' && s2 === 'Spring') ||
    (s1 === 'Fall' && s2 === 'Winter') ||
    (s1 === 'Winter' && s2 === 'Fall');

  if (isAdjacent) {
    return { score: 86, description: 'Complementary transitional weather layering.' };
  }

  // Opposing seasons (Summer lightweight vs Winter heavyweight)
  return { score: 62, description: 'Subtle fabric weight disparity across seasons.' };
}

/**
 * Selects an authentic, context-aware Cher Horowitz quote based on the evaluation result.
 */
function pickCherQuote(
  isIconic: boolean,
  status: 'MATCH' | 'MISMATCH',
  score: number,
  primaryClashReason?: string
): string {
  if (isIconic) {
    return '“Totally iconic! You look like a total Betty — pure Beverly Hills perfection!”';
  }

  if (status === 'MISMATCH') {
    if (primaryClashReason?.includes('tartan') || primaryClashReason?.includes('pattern')) {
      return '“Ugh, AS IF! Two conflicting prints?! You look like a walking picnic blanket disaster!”';
    }
    if (primaryClashReason?.includes('formality') || primaryClashReason?.includes('Party')) {
      return '“Did you get dressed in a blackout?! You cannot wear evening couture with that slouchy bottom!”';
    }
    if (primaryClashReason?.includes('primary') || primaryClashReason?.includes('saturated')) {
      return '“Majorly uncool! That combination is giving fast-food condiment realness. As if!”';
    }
    if (score < 40) {
      return '“Whatever! Something about this is totally buggin’. My computer refuses to endorse this!”';
    }
    return '“Hmm, it’s not an absolute catastrophe, but Daddy didn’t raise a fashion amateur. Try another combo!”';
  }

  // Matches
  if (score >= 94) {
    return '“I’m totally paused! Monochromatic elegance and tailored balance always look like a million bucks!”';
  }
  if (score >= 88) {
    return '“Majorly chic! Very Ralph Lauren prep meets high-society Beverly Hills perfection!”';
  }
  if (score >= 82) {
    return '“Ensemble goals! Perfectly coordinated proportions that look effortlessly photo-ready!”';
  }
  return '“Looking good! The style mood aligns nicely for today’s agenda!”';
}

/**
 * Master Fashion Matching Engine.
 * Combines exact coordinate set recognition with general multi-dimensional algorithmic scoring
 * to intelligently evaluate any garments — including custom user-uploaded clothes!
 */
export function evaluateMatch(top: Garment, bottom: Garment): MatchVerdict {
  if (!top || !bottom) {
    return {
      status: 'MISMATCH',
      score: 0,
      title: 'EMPTY',
      quote: 'Select garments to evaluate ensemble!',
      explanation: 'Both top and bottom must be loaded into the carousels.',
    };
  }

  // 1. Cher's Iconic Coordinated Sets (Easter Egg Priority)
  if (top.suitSetId && top.suitSetId === bottom.suitSetId) {
    if (top.suitSetId === 'yellow_plaid') {
      return {
        status: 'MATCH',
        score: 100,
        title: 'MATCH!',
        isIconic: true,
        quote: '“Totally iconic! You look like a total Betty — pure Beverly Hills perfection!”',
        explanation: 'Cher’s signature yellow tartan ensemble. 100% timeless fashion history.',
      };
    }
    if (top.suitSetId === 'red_alaia') {
      return {
        status: 'MATCH',
        score: 100,
        title: 'MATCH!',
        isIconic: true,
        quote: '“It’s an Alaïa! Like, a totally important designer! Absolutely breathtaking!”',
        explanation: 'Monochromatic crimson Alaïa silhouette tailored to turn heads.',
      };
    }
    return {
      status: 'MATCH',
      score: 98,
      title: 'MATCH!',
      isIconic: true,
      quote: '“Ensemble goals! Perfectly coordinated from top to bottom!”',
      explanation: 'Matching coordinate set with flawless proportion, palette, and texture unity.',
    };
  }

  // 2. Multi-Dimensional Algorithmic Evaluation
  const colorEval = evaluateColorHarmony(top, bottom);
  const patternEval = evaluatePatternHarmony(top, bottom);
  const styleEval = evaluateStyleHarmony(top.style, bottom.style);
  const seasonEval = evaluateSeasonHarmony(top.season, bottom.season);

  // Check for fatal fashion clash overrides
  const isFatalClash = colorEval.isClash || patternEval.isClash || styleEval.isClash;

  let calculatedScore: number;
  let primaryClashReason: string | undefined;

  if (isFatalClash) {
    // Find lowest score among clashing dimensions
    const clashingScores = [
      colorEval.isClash ? colorEval.score : 100,
      patternEval.isClash ? patternEval.score : 100,
      styleEval.isClash ? styleEval.score : 100,
    ];
    calculatedScore = Math.min(...clashingScores);

    if (patternEval.isClash) primaryClashReason = patternEval.description;
    else if (styleEval.isClash) primaryClashReason = styleEval.description;
    else primaryClashReason = colorEval.description;
  } else {
    // Weighted multi-factor synthesis:
    // Color: 35%, Pattern: 30%, Style: 25%, Season: 10%
    const weighted =
      colorEval.score * 0.35 +
      patternEval.score * 0.30 +
      styleEval.score * 0.25 +
      seasonEval.score * 0.10;

    calculatedScore = Math.round(Math.min(99, Math.max(15, weighted)));
  }

  const isMatch = calculatedScore >= 75;
  const quote = pickCherQuote(false, isMatch ? 'MATCH' : 'MISMATCH', calculatedScore, primaryClashReason);

  // Formulate clear, intelligent explanation combining the dominant factors
  const dominantInsights: string[] = [];
  if (colorEval.description) dominantInsights.push(colorEval.description);
  if (patternEval.description) dominantInsights.push(patternEval.description);
  if (styleEval.description && (styleEval.isClash || styleEval.score >= 90)) {
    dominantInsights.push(styleEval.description);
  }

  const explanation = dominantInsights.slice(0, 2).join(' ');

  return {
    status: isMatch ? 'MATCH' : 'MISMATCH',
    score: calculatedScore,
    title: isMatch ? 'MATCH!' : 'MIS-MATCH!',
    isIconic: calculatedScore >= 98,
    quote,
    explanation,
  };
}
