import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Path, Circle } from 'react-native-svg';

interface LeopardBackgroundProps {
  children?: React.ReactNode;
}

export const LeopardBackground: React.FC<LeopardBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="leopardPrint" width="90" height="90" patternUnits="userSpaceOnUse">
              {/* Base warm caramel background */}
              <Rect width="90" height="90" fill="#d89644" />
              {/* Subtle gold fur shading */}
              <Circle cx="35" cy="40" r="28" fill="#e2a758" opacity="0.4" />
              <Circle cx="80" cy="75" r="20" fill="#cca652" opacity="0.3" />

              {/* Rosette 1 (Center-Left) */}
              <Circle cx="26" cy="30" r="9" fill="#934d1c" />
              <Path
                d="M 17 22 C 14 28 17 38 27 40 C 36 41 38 31 36 24"
                fill="none"
                stroke="#180e05"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <Circle cx="21" cy="18" r="3.5" fill="#180e05" />

              {/* Rosette 2 (Top-Right) */}
              <Circle cx="72" cy="22" r="8" fill="#934d1c" />
              <Path
                d="M 64 16 C 62 25 72 32 80 28"
                fill="none"
                stroke="#180e05"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <Path
                d="M 76 13 C 82 16 83 23 79 26"
                fill="none"
                stroke="#180e05"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Rosette 3 (Bottom-Center) */}
              <Circle cx="50" cy="72" r="10" fill="#934d1c" />
              <Path
                d="M 40 65 C 38 75 45 84 57 82"
                fill="none"
                stroke="#180e05"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <Path
                d="M 52 61 C 60 62 64 71 59 78"
                fill="none"
                stroke="#180e05"
                strokeWidth="4.5"
                strokeLinecap="round"
              />

              {/* Small accent spots */}
              <Circle cx="7" cy="65" r="4.5" fill="#180e05" />
              <Circle cx="85" cy="55" r="3.5" fill="#180e05" />
              <Circle cx="48" cy="10" r="3.5" fill="#180e05" />
              <Circle cx="8" cy="8" r="3" fill="#180e05" />
              <Circle cx="85" cy="85" r="4" fill="#180e05" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#leopardPrint)" />
        </Svg>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#d89644',
  },
});
