import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MatchVerdict } from '../../types/wardrobe';
import { RetroTheme } from '../../theme/retroTheme';

interface VerdictBannerProps {
  verdict: MatchVerdict;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict }) => {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const isMatch = verdict.status === 'MATCH';

  useEffect(() => {
    // Blinking effect for mismatch alert
    if (!isMatch) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.2,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      blinkAnim.setValue(1);
    }
  }, [verdict.status, isMatch]);

  return (
    <View
      style={[
        styles.container,
        isMatch ? styles.matchContainer : styles.mismatchContainer,
      ]}
    >
      {/* Top Banner with Verdict Title */}
      <Animated.View
        style={[
          styles.titleBar,
          isMatch ? styles.matchTitleBar : styles.mismatchTitleBar,
          { opacity: blinkAnim },
        ]}
      >
        <Text
          style={[
            styles.titleText,
            isMatch ? styles.matchText : styles.mismatchText,
          ]}
        >
          {verdict.title}
        </Text>
        <View
          style={[
            styles.scorePill,
            isMatch ? styles.matchScorePill : styles.mismatchScorePill,
          ]}
        >
          <Text style={styles.scoreText}>{verdict.score}%</Text>
        </View>
      </Animated.View>

      {/* Cher's Commentary Quote */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>{verdict.quote}</Text>
        <Text style={styles.explanationText}>{verdict.explanation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    marginVertical: 6,
    marginHorizontal: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  matchContainer: {
    borderColor: RetroTheme.colors.matchGreenBorder,
    backgroundColor: '#062612',
  },
  mismatchContainer: {
    borderColor: RetroTheme.colors.mismatchRedBorder,
    backgroundColor: '#2b060d',
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  matchTitleBar: {
    backgroundColor: '#0a421f',
  },
  mismatchTitleBar: {
    backgroundColor: '#610c1b',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  matchText: {
    color: '#39ff14',
    textShadowColor: '#00ff66',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  mismatchText: {
    color: '#ff2a55',
    textShadowColor: '#ff0033',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  scorePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
  },
  matchScorePill: {
    borderColor: '#39ff14',
    backgroundColor: '#03230e',
  },
  mismatchScorePill: {
    borderColor: '#ff2a55',
    backgroundColor: '#3b060f',
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quoteBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  quoteText: {
    color: '#ffe600',
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 2,
  },
  explanationText: {
    color: '#e5e7eb',
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.85,
  },
});
