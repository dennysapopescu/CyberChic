import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Garment } from '../../types/wardrobe';
import { GarmentIllustration } from '../matcher/GarmentIllustration';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';

interface GarmentDetailModalProps {
  visible: boolean;
  garment: Garment | null;
  onClose: () => void;
  onEdit?: (garment: Garment) => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({
  visible,
  garment,
  onClose,
  onEdit,
}) => {
  if (!garment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.windowFrame}>
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>ITEM INSPECTOR — {garment.name.toUpperCase()}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <View style={styles.imageBox}>
              <GarmentIllustration garment={garment} width={220} height={160} />
            </View>

            {/* Info Grid */}
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>CATEGORY:</Text>
                <Text style={styles.value}>{garment.category.toUpperCase()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>COLOR:</Text>
                <Text style={styles.value}>{garment.colorName} ({garment.color})</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>STYLE MOOD:</Text>
                <Text style={styles.value}>{garment.style}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>PATTERN:</Text>
                <Text style={styles.value}>{garment.pattern.toUpperCase()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>SEASON:</Text>
                <Text style={styles.value}>{garment.season}</Text>
              </View>
            </View>

            {/* Description */}
            {garment.description ? (
              <View style={styles.descBox}>
                <Text style={styles.descText}>{garment.description}</Text>
              </View>
            ) : null}

            {/* Footer Buttons */}
            <View style={styles.footer}>
              {onEdit && (
                <BevelButton
                  title="✏️ EDIT ITEM"
                  variant="yellow"
                  size="md"
                  onPress={() => {
                    onClose();
                    onEdit(garment);
                  }}
                  style={styles.actionBtn}
                />
              )}
              <BevelButton
                title="CLOSE INSPECTOR"
                variant="pink"
                size="md"
                onPress={onClose}
                style={styles.actionBtn}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  windowFrame: {
    backgroundColor: RetroTheme.colors.winGray,
    borderWidth: 3,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    width: '100%',
    maxWidth: 420,
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
  body: {
    padding: 12,
  },
  imageBox: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTable: {
    backgroundColor: '#e5e5e5',
    borderWidth: 1,
    borderColor: '#9ca3af',
    padding: 8,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  value: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  descBox: {
    backgroundColor: '#fdfbf7',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 8,
    marginBottom: 12,
  },
  descText: {
    fontSize: 11,
    color: '#4b5563',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
