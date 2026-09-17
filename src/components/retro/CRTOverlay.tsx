import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';

interface CRTOverlayProps {
  enabled?: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <View pointerEvents="none" style={styles.overlayContainer}>
      {/* Scanline pattern for web */}
      {Platform.OS === 'web' && (
        <View
          style={[
            styles.scanlines,
            {
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 3px)',
            } as any,
          ]}
        />
      )}
      {/* Glass vignette & subtle curved monitor reflection */}
      <View style={styles.vignette} />
      <View style={styles.glassReflection} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    overflow: 'hidden',
  },
  scanlines: {
    ...StyleSheet.absoluteFill,
    opacity: 0.7,
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    backgroundColor: 'transparent',
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
});
