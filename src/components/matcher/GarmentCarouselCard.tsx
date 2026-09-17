import React from 'react';
import { View, Text, StyleSheet, PanResponder, Platform } from 'react-native';
import { Garment } from '../../types/wardrobe';
import { GarmentIllustration } from './GarmentIllustration';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';

interface GarmentCarouselCardProps {
  label: string;
  garments: Garment[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectDetails?: (garment: Garment) => void;
  height?: number;
}

export const GarmentCarouselCard: React.FC<GarmentCarouselCardProps> = ({
  label,
  garments,
  currentIndex,
  onPrev,
  onNext,
  onSelectDetails,
  height = 200,
}) => {
  const currentGarment = garments[currentIndex] || null;

  // Simple pan responder for swipe gestures on mobile/tablet
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 40) {
          onPrev();
        } else if (gestureState.dx < -40) {
          onNext();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Top Header Tag */}
      <View style={styles.headerBar}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{label.toUpperCase()}</Text>
        </View>
        <Text style={styles.counterText}>
          {garments.length > 0 ? `${currentIndex + 1} OF ${garments.length}` : '0 / 0'}
        </Text>
      </View>

      {/* Main Illustration Display Frame */}
      <View
        style={[styles.displayFrame, { height }]}
        {...panResponder.panHandlers}
      >
        {currentGarment ? (
          <>
            <GarmentIllustration
              garment={currentGarment}
              width={260}
              height={height - 40}
            />
            {/* Garment Title Ribbon */}
            <View style={styles.nameRibbon}>
              <Text style={styles.garmentName} numberOfLines={1}>
                {currentGarment.name.toUpperCase()}
              </Text>
              <Text style={styles.garmentMeta} numberOfLines={1}>
                {currentGarment.colorName} • {currentGarment.style}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>NO GARMENTS AVAILABLE</Text>
          </View>
        )}
      </View>

      {/* Navigation Buttons: << | >> */}
      <View style={styles.controlsRow}>
        <BevelButton
          title="<<"
          variant="gray"
          size="sm"
          onPress={onPrev}
          style={styles.navButton}
          textStyle={styles.navButtonText}
        />
        <BevelButton
          title="|"
          variant="yellow"
          size="sm"
          onPress={() => currentGarment && onSelectDetails?.(currentGarment)}
          style={styles.infoButton}
          textStyle={styles.infoButtonText}
        />
        <BevelButton
          title=">>"
          variant="gray"
          size="sm"
          onPress={onNext}
          style={styles.navButton}
          textStyle={styles.navButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ececec',
    borderWidth: 2,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
    padding: 6,
    marginVertical: 4,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  tagBadge: {
    backgroundColor: RetroTheme.colors.cherPink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  counterText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444444',
  },
  displayFrame: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  nameRibbon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(240, 240, 240, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  garmentName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
  },
  garmentMeta: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 1,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  navButton: {
    minWidth: 52,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
  },
  infoButton: {
    minWidth: 36,
  },
  infoButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
  },
});
