const test = require('node:test');
const { describe, it } = test;
const assert = require('node:assert/strict');
const { evaluateMatch } = require('./.cache/services/matchEngine');
const { findMatchingOutfit } = require('./.cache/services/dressMe');
const { STARTER_GARMENTS } = require('./.cache/data/starterPack');

describe('CyberChic 95 Matching Engine', () => {
  const tops = STARTER_GARMENTS.filter((g) => g.category === 'top');
  const bottoms = STARTER_GARMENTS.filter((g) => g.category === 'bottom');

  describe('1. Iconic Clueless Outfits', () => {
    it('evaluates Cher’s iconic Yellow Plaid ensemble with a perfect 100% score', () => {
      const plaidTop = tops.find((g) => g.id === 'top-yellow-plaid');
      const plaidBottom = bottoms.find((g) => g.id === 'bottom-yellow-plaid');

      assert.ok(plaidTop, 'Yellow plaid top should exist in starter pack');
      assert.ok(plaidBottom, 'Yellow plaid skirt should exist in starter pack');

      const verdict = evaluateMatch(plaidTop, plaidBottom);
      assert.equal(verdict.status, 'MATCH');
      assert.equal(verdict.score, 100);
      assert.equal(verdict.title, 'MATCH!');
      assert.equal(verdict.isIconic, true);
      assert.match(verdict.quote, /Cher Horowitz|Iconic|Alaïa|coup/i);
    });

    it('evaluates Cher’s iconic Alaïa Crimson party dress with a perfect 100% score', () => {
      const redTop = tops.find((g) => g.id === 'top-red-alaia');
      const redBottom = bottoms.find((g) => g.id === 'bottom-red-alaia');

      assert.ok(redTop, 'Red Alaïa top should exist');
      assert.ok(redBottom, 'Red Alaïa skirt should exist');

      const verdict = evaluateMatch(redTop, redBottom);
      assert.equal(verdict.status, 'MATCH');
      assert.equal(verdict.score, 100);
      assert.equal(verdict.isIconic, true);
    });
  });

  describe('2. Color Theory & Neutral Anchoring', () => {
    it('rewards neutral + accent color combinations (Black + Pink)', () => {
      const blackTop = {
        id: 'test-black-top',
        name: 'Black Mock Turtleneck',
        category: 'top',
        color: '#111827',
        colorName: 'Noir Black',
        pattern: 'solid',
        style: 'Chic',
        season: 'All',
      };
      const pinkSkirt = {
        id: 'test-pink-skirt',
        name: 'Beverly Pink Pleated Skirt',
        category: 'bottom',
        color: '#ff1493',
        colorName: 'Beverly Pink',
        pattern: 'solid',
        style: 'Chic',
        season: 'All',
      };

      const verdict = evaluateMatch(blackTop, pinkSkirt);
      assert.equal(verdict.status, 'MATCH');
      assert.ok(verdict.score >= 80, `Expected score >= 80, got ${verdict.score}`);
    });

    it('rewards neutral white tee grounded with denim bottoms', () => {
      const whiteTee = tops.find((g) => g.id === 'top-as-if-babytee');
      const denimSkirt = {
        id: 'test-denim-skirt',
        name: 'Classic Stonewash Skirt',
        category: 'bottom',
        color: '#4682b4',
        colorName: 'Stonewash Blue',
        pattern: 'denim',
        style: 'Casual',
        season: 'Summer',
      };

      const verdict = evaluateMatch(whiteTee, denimSkirt);
      assert.equal(verdict.status, 'MATCH');
      assert.ok(verdict.score >= 80, `Expected score >= 80, got ${verdict.score}`);
    });
  });

  describe('3. Pattern Clash & Balance Dynamics', () => {
    it('penalizes competing mismatched plaids heavily as a fashion clash', () => {
      const yellowPlaidTop = tops.find((g) => g.id === 'top-yellow-plaid');
      const conflictingPlaidBottom = {
        id: 'test-clash-plaid',
        name: 'Red Stewart Tartan Pants',
        category: 'bottom',
        color: '#c8102e',
        colorName: 'Stewart Red',
        pattern: 'plaid',
        style: 'Grunge',
        season: 'Fall',
      };

      const verdict = evaluateMatch(yellowPlaidTop, conflictingPlaidBottom);
      assert.equal(verdict.status, 'MISMATCH');
      assert.ok(verdict.score <= 35, `Expected score <= 35 for competing plaids, got ${verdict.score}`);
      assert.equal(verdict.title, 'MIS-MATCH!');
      assert.match(verdict.explanation, /tartan|plaid|competing/i);
    });

    it('rewards a statement pattern paired with a solid grounding piece', () => {
      const argyleTop = tops.find((g) => g.id === 'top-argyle-vest');
      const solidBlackSkirt = {
        id: 'test-solid-black-skirt',
        name: 'Noir Pleated Tennis Skirt',
        category: 'bottom',
        color: '#111827',
        colorName: 'Noir Black',
        pattern: 'solid',
        style: 'School',
        season: 'Fall',
      };

      const verdict = evaluateMatch(argyleTop, solidBlackSkirt);
      assert.equal(verdict.status, 'MATCH');
      assert.ok(verdict.score >= 80, `Expected score >= 80, got ${verdict.score}`);
    });
  });

  describe('4. Style & Formality Synergy', () => {
    it('penalizes severe style dissonance (Party couture top + Casual grunge sweats)', () => {
      const alaiaTop = tops.find((g) => g.id === 'top-red-alaia');
      const sweatpants = {
        id: 'test-grunge-sweatpants',
        name: 'Baggy Heather Gray Sweatpants',
        category: 'bottom',
        color: '#9ca3af',
        colorName: 'Heather Gray',
        pattern: 'solid',
        style: 'Grunge',
        season: 'Winter',
      };

      const verdict = evaluateMatch(alaiaTop, sweatpants);
      assert.equal(verdict.status, 'MISMATCH');
      assert.ok(verdict.score < 50, `Expected score < 50 for style clash, got ${verdict.score}`);
    });
  });

  describe('5. DRESS ME Slot Machine Engine', () => {
    it('produces a guaranteed high-compatibility MATCH from the wardrobe', () => {
      const result = findMatchingOutfit(tops, bottoms);
      assert.ok(result, 'findMatchingOutfit should return an outfit');
      assert.ok(result.top, 'Selected outfit must have a top');
      assert.ok(result.bottom, 'Selected outfit must have a bottom');

      const verdict = evaluateMatch(result.top, result.bottom);
      assert.equal(verdict.status, 'MATCH');
      assert.ok(verdict.score >= 75, `Expected MATCH score >= 75, got ${verdict.score}`);
    });
  });
});
