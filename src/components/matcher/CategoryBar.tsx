import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { BevelButton } from '../retro/BevelButton';
import { GarmentCategory } from '../../types/wardrobe';

interface CategoryBarProps {
  userName?: string;
  onOpenProfile?: () => void;
  onSelectCategoryFilter: (category: GarmentCategory | 'all') => void;
  onOpenBrowse: () => void;
  onDressMe: () => void;
  onOpenLookbook: () => void;
  isSpinning: boolean;
  isMuted: boolean;
  onToggleSound: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  userName = 'Denny',
  onOpenProfile,
  onSelectCategoryFilter,
  onOpenBrowse,
  onDressMe,
  onOpenLookbook,
  isSpinning,
  isMuted,
  onToggleSound,
  isCrtEnabled,
  onToggleCrt,
}) => {
  return (
    <View style={styles.container}>
      {/* 90s Category Buttons Row */}
      <View style={styles.categoryRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <BevelButton
            title="SHOES"
            variant="gray"
            size="sm"
            onPress={() => onSelectCategoryFilter('shoes')}
            style={styles.catBtn}
          />
          <BevelButton
            title="JEWELRY"
            variant="gray"
            size="sm"
            onPress={() => onSelectCategoryFilter('accessory')}
            style={styles.catBtn}
          />
          <BevelButton
            title="SCARVES"
            variant="gray"
            size="sm"
            onPress={() => onSelectCategoryFilter('accessory')}
            style={styles.catBtn}
          />
          <BevelButton
            title="PANTS"
            variant="gray"
            size="sm"
            onPress={() => onSelectCategoryFilter('bottom')}
            style={styles.catBtn}
          />
          <BevelButton
            title="JACKETS"
            variant="gray"
            size="sm"
            onPress={() => onSelectCategoryFilter('top')}
            style={styles.catBtn}
          />
        </ScrollView>
      </View>

      {/* Main Action Command Row */}
      <View style={styles.commandRow}>
        <BevelButton
          title="📂 BROWSE"
          variant="gray"
          size="md"
          onPress={onOpenBrowse}
          style={styles.actionBtn}
        />

        <BevelButton
          title={isSpinning ? "🎰 MATCHING..." : "✨ DRESS ME"}
          variant="pink"
          size="md"
          disabled={isSpinning}
          onPress={onDressMe}
          style={[styles.actionBtn, styles.dressMeBtn]}
          textStyle={styles.dressMeText}
        />

        <BevelButton
          title="📖 LOOKBOOK"
          variant="yellow"
          size="md"
          onPress={onOpenLookbook}
          style={styles.actionBtn}
        />
      </View>

      {/* Retro Utility Bar */}
      <View style={styles.utilityRow}>
        {onOpenProfile && (
          <BevelButton
            title={`👤 ${userName.toUpperCase()}`}
            variant="pink"
            size="sm"
            onPress={onOpenProfile}
            style={styles.utilBtn}
          />
        )}
        <BevelButton
          title={isMuted ? "🔇 SOUND: OFF" : "🔊 SOUND: ON"}
          variant="gray"
          size="sm"
          onPress={onToggleSound}
          style={styles.utilBtn}
        />
        <BevelButton
          title={isCrtEnabled ? "📺 CRT: ON" : "📺 CRT: OFF"}
          variant="gray"
          size="sm"
          onPress={onToggleCrt}
          style={styles.utilBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#ffffff',
    padding: 6,
    marginTop: 4,
  },
  categoryRow: {
    marginBottom: 6,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 2,
  },
  catBtn: {
    minWidth: 70,
  },
  commandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 6,
  },
  actionBtn: {
    flex: 1,
  },
  dressMeBtn: {
    flex: 1.3,
  },
  dressMeText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  utilBtn: {
    minWidth: 120,
  },
});
