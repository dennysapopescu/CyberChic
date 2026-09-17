import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Garment, LookbookOutfit, MatchVerdict } from '../../types/wardrobe';
import { GarmentIllustration } from '../matcher/GarmentIllustration';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';

interface LookbookModalProps {
  visible: boolean;
  userName?: string;
  currentTop: Garment;
  currentBottom: Garment;
  currentShoes?: Garment;
  currentAccessory?: Garment;
  currentVerdict: MatchVerdict;
  savedOutfits: LookbookOutfit[];
  onClose: () => void;
  onSaveCurrentLook: (name: string) => void;
  onEquipOutfit: (outfit: LookbookOutfit) => void;
  onDeleteOutfit: (id: string) => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  visible,
  userName = 'User',
  currentTop,
  currentBottom,
  currentVerdict,
  savedOutfits,
  onClose,
  onSaveCurrentLook,
  onEquipOutfit,
  onDeleteOutfit,
}) => {
  const [outfitName, setOutfitName] = useState('');

  const handleSave = () => {
    const name = outfitName.trim() || `${userName}'s Look #${savedOutfits.length + 1}`;
    onSaveCurrentLook(name);
    setOutfitName('');
    SoundEffects.play('match');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.windowFrame}>
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>{userName.toUpperCase()}'S LOOKBOOK ARCHIVE — [SAVED ENSEMBLES]</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Quick Save Current Look Bar */}
          <View style={styles.saveSection}>
            <Text style={styles.saveHeader}>SAVE CURRENT SELECTION TO LOOKBOOK:</Text>
            <View style={styles.saveInputRow}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Christian’s Beverly Hills Party"
                placeholderTextColor="#888"
                value={outfitName}
                onChangeText={setOutfitName}
              />
              <BevelButton
                title="💾 SAVE LOOK"
                variant="pink"
                size="sm"
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
          </View>

          {/* Saved Outfits List */}
          <ScrollView style={styles.listContainer}>
            {savedOutfits.map((outfit) => (
              <View key={outfit.id} style={styles.outfitCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.outfitTitle}>{outfit.name.toUpperCase()}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{outfit.score}% MATCH</Text>
                    </View>
                    <Pressable
                      onPress={() => onDeleteOutfit(outfit.id)}
                      style={styles.deleteBtn}
                    >
                      <Text style={styles.deleteBtnText}>✕</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Garments Preview Thumbnails */}
                <View style={styles.garmentRow}>
                  <View style={styles.garmentItem}>
                    <GarmentIllustration garment={outfit.top} width={70} height={60} />
                    <Text style={styles.garmentLabel} numberOfLines={1}>{outfit.top.name}</Text>
                  </View>
                  <Text style={styles.plusSign}>+</Text>
                  <View style={styles.garmentItem}>
                    <GarmentIllustration garment={outfit.bottom} width={70} height={60} />
                    <Text style={styles.garmentLabel} numberOfLines={1}>{outfit.bottom.name}</Text>
                  </View>
                </View>

                <Text style={styles.quoteSnippet}>“{outfit.quote}”</Text>

                <View style={styles.cardActions}>
                  <BevelButton
                    title="👗 EQUIP THIS OUTFIT"
                    variant="yellow"
                    size="sm"
                    onPress={() => {
                      SoundEffects.play('click');
                      onEquipOutfit(outfit);
                      onClose();
                    }}
                    style={styles.equipBtn}
                  />
                </View>
              </View>
            ))}

            {savedOutfits.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>NO SAVED LOOKS YET</Text>
                <Text style={styles.emptySubtitle}>
                  Combine tops and bottoms on the matcher and press "SAVE LOOK" to start building your personal Lookbook!
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <BevelButton
              title="CLOSE LOOKBOOK"
              variant="gray"
              size="md"
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
    maxWidth: 580,
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
  saveSection: {
    padding: 8,
    backgroundColor: '#dcdcdc',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  saveHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  saveInputRow: {
    flexDirection: 'row',
    gap: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
  },
  saveBtn: {
    minWidth: 90,
  },
  listContainer: {
    flex: 1,
    padding: 8,
  },
  outfitCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
    padding: 8,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  outfitTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreBadge: {
    backgroundColor: RetroTheme.colors.matchGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  scoreText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
  deleteBtn: {
    backgroundColor: '#ff0033',
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  garmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  garmentItem: {
    alignItems: 'center',
    maxWidth: 90,
  },
  garmentLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  plusSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff1493',
  },
  quoteSnippet: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#4b5563',
    textAlign: 'center',
    marginVertical: 4,
  },
  cardActions: {
    marginTop: 4,
  },
  equipBtn: {
    width: '100%',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#6b7280',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    padding: 6,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#808080',
    alignItems: 'center',
  },
  closeFooterBtn: {
    minWidth: 140,
  },
});
