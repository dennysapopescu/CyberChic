import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Garment, GarmentCategory } from '../../types/wardrobe';
import { GarmentIllustration } from '../matcher/GarmentIllustration';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';

interface BrowseModalProps {
  visible: boolean;
  userName?: string;
  garments: Garment[];
  onClose: () => void;
  onSelectGarment: (garment: Garment) => void;
  onOpenAddModal: () => void;
  onDeleteGarment: (id: string) => void;
  onResetWardrobe: () => void;
}

export const BrowseModal: React.FC<BrowseModalProps> = ({
  visible,
  userName = 'User',
  garments,
  onClose,
  onSelectGarment,
  onOpenAddModal,
  onDeleteGarment,
  onResetWardrobe,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | GarmentCategory>('all');

  const filteredGarments = garments.filter((g) => {
    if (selectedFilter === 'all') return true;
    return g.category === selectedFilter;
  });

  const handleGarmentPress = (garment: Garment) => {
    SoundEffects.play('click');
    onSelectGarment(garment);
    onClose();
  };

  const confirmDelete = (garment: Garment) => {
    Alert.alert(
      'Remove Garment',
      `Are you sure you want to discard "${garment.name}" from ${userName}'s wardrobe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => onDeleteGarment(garment.id),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.windowFrame}>
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>{userName.toUpperCase()}'S WARDROBE EXPLORER — [BROWSE]</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Action Ribbon */}
          <View style={styles.actionRibbon}>
            <BevelButton
              title="✨ + ADD NEW CLOTHES"
              variant="pink"
              size="sm"
              onPress={onOpenAddModal}
              style={styles.addBtn}
            />
            <BevelButton
              title="🔄 RESET STARTER PACK"
              variant="gray"
              size="sm"
              onPress={() => {
                Alert.alert('Reset Wardrobe', 'Restore default Clueless starter pack items?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', onPress: onResetWardrobe },
                ]);
              }}
            />
          </View>

          {/* Category Filter Tabs */}
          <View style={styles.filterTabs}>
            {(['all', 'top', 'bottom', 'shoes', 'accessory'] as const).map((tab) => (
              <BevelButton
                key={tab}
                title={tab.toUpperCase()}
                variant={selectedFilter === tab ? 'yellow' : 'gray'}
                size="sm"
                active={selectedFilter === tab}
                onPress={() => setSelectedFilter(tab)}
                style={styles.filterBtn}
              />
            ))}
          </View>

          {/* Garments Grid */}
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {filteredGarments.map((garment) => (
              <Pressable
                key={garment.id}
                onPress={() => handleGarmentPress(garment)}
                style={styles.gridCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCatBadge}>{garment.category.toUpperCase()}</Text>
                  {garment.isCustom && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        confirmDelete(garment);
                      }}
                      style={styles.deleteBadge}
                    >
                      <Text style={styles.deleteBadgeText}>✕</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.illustrationBox}>
                  <GarmentIllustration garment={garment} width={130} height={100} />
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {garment.name}
                  </Text>
                  <Text style={styles.cardStyle}>
                    {garment.colorName} • {garment.style}
                  </Text>
                </View>
              </Pressable>
            ))}

            {filteredGarments.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No items found in this category.</Text>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerHint}>
              TIP: TAP ANY PIECE TO EQUIP DIRECTLY ONTO THE MATCHER
            </Text>
            <BevelButton
              title="CLOSE"
              variant="gray"
              size="sm"
              onPress={onClose}
              style={styles.closeFooterBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  windowFrame: {
    backgroundColor: RetroTheme.colors.winGray,
    borderWidth: 3,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    width: '100%',
    maxWidth: 640,
    height: '85%',
  },
  titleBar: {
    backgroundColor: '#000080',
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  closeBtn: {
    width: 18,
    height: 18,
    backgroundColor: '#c0c0c0',
    borderWidth: 1,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    backgroundColor: '#dcdcdc',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
    gap: 8,
  },
  addBtn: {
    flex: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    padding: 6,
    backgroundColor: '#c0c0c0',
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#808080',
  },
  filterBtn: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6,
    gap: 8,
    justifyContent: 'flex-start',
  },
  gridCard: {
    width: '31%',
    minWidth: 140,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
    padding: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardCatBadge: {
    backgroundColor: RetroTheme.colors.cherYellow,
    color: '#000000',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  deleteBadge: {
    backgroundColor: '#ff0033',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  illustrationBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    marginTop: 4,
  },
  cardName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  cardStyle: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 1,
  },
  emptyState: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#808080',
  },
  footerHint: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  closeFooterBtn: {
    minWidth: 80,
  },
});
