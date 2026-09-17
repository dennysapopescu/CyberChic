import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Garment, GarmentCategory, GarmentPattern, GarmentStyle } from '../../types/wardrobe';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';

interface AddGarmentModalProps {
  visible: boolean;
  userName?: string;
  onClose: () => void;
  onSave: (garment: Garment) => void;
}

const COLOR_PALETTE = [
  { name: 'Cher Yellow', hex: '#ffd700' },
  { name: 'Alaïa Crimson', hex: '#c8102e' },
  { name: 'Beverly Pink', hex: '#ff1493' },
  { name: 'Noir Black', hex: '#111827' },
  { name: 'Optic White', hex: '#ffffff' },
  { name: 'Stonewash Blue', hex: '#4682b4' },
  { name: 'Pastel Lilac', hex: '#b39ddb' },
  { name: 'Beverly Emerald', hex: '#10b981' },
  { name: 'Neon Orange', hex: '#f97316' },
];

export const AddGarmentModal: React.FC<AddGarmentModalProps> = ({
  visible,
  userName = 'User',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('top');
  const [styleMood, setStyleMood] = useState<GarmentStyle>('Chic');
  const [pattern, setPattern] = useState<GarmentPattern>('solid');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const pickImageFromGallery = async () => {
    try {
      SoundEffects.play('click');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Image Error', 'Could not select photo from gallery.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      SoundEffects.play('click');
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera Permission Required', 'Please enable camera access to snap clothes.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Camera Error', 'Could not open camera.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for this garment!');
      return;
    }

    const newGarment: Garment = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      color: selectedColor.hex,
      colorName: selectedColor.name,
      pattern,
      style: styleMood,
      season: 'All',
      imageUri: imageUri || undefined,
      description: description.trim() || `Custom piece added to ${userName}’s wardrobe.`,
      isCustom: true,
      createdAt: Date.now(),
    };

    onSave(newGarment);
    SoundEffects.play('match');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setCategory('top');
    setStyleMood('Chic');
    setPattern('solid');
    setSelectedColor(COLOR_PALETTE[0]);
    setImageUri(null);
    setDescription('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.windowFrame}>
          {/* 90s Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>ADD NEW CLOTHES — DIGITIZER WIZARD</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Image Preview & Capture Buttons */}
            <View style={styles.photoSection}>
              <View style={styles.previewBox}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
                ) : (
                  <View style={[styles.colorPreview, { backgroundColor: selectedColor.hex }]}>
                    <Text style={styles.colorPreviewText}>{pattern.toUpperCase()}</Text>
                  </View>
                )}
              </View>

              <View style={styles.photoButtons}>
                <BevelButton
                  title="📸 TAKE PHOTO"
                  variant="yellow"
                  size="sm"
                  onPress={takePhotoWithCamera}
                  style={styles.btnSmall}
                />
                <BevelButton
                  title="🖼️ FROM GALLERY"
                  variant="gray"
                  size="sm"
                  onPress={pickImageFromGallery}
                  style={styles.btnSmall}
                />
                {imageUri ? (
                  <BevelButton
                    title="✕ REMOVE PHOTO"
                    variant="red"
                    size="sm"
                    onPress={() => setImageUri(null)}
                    style={styles.btnSmall}
                  />
                ) : null}
              </View>
            </View>

            {/* Garment Name Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>GARMENT NAME:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Vintage Tweed Crop Jacket"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CATEGORY:</Text>
              <View style={styles.toggleRow}>
                {(['top', 'bottom', 'shoes', 'accessory'] as GarmentCategory[]).map((cat) => (
                  <BevelButton
                    key={cat}
                    title={cat.toUpperCase()}
                    variant={category === cat ? 'pink' : 'gray'}
                    size="sm"
                    active={category === cat}
                    onPress={() => setCategory(cat)}
                    style={styles.categoryBtn}
                  />
                ))}
              </View>
            </View>

            {/* Style Mood Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>STYLE MOOD:</Text>
              <View style={styles.toggleRow}>
                {(['School', 'Chic', 'Party', 'Casual', 'Grunge'] as GarmentStyle[]).map((st) => (
                  <BevelButton
                    key={st}
                    title={st}
                    variant={styleMood === st ? 'pink' : 'gray'}
                    size="sm"
                    active={styleMood === st}
                    onPress={() => setStyleMood(st)}
                    style={styles.categoryBtn}
                  />
                ))}
              </View>
            </View>

            {/* Pattern Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PATTERN:</Text>
              <View style={styles.toggleRow}>
                {(['solid', 'plaid', 'striped', 'floral', 'metallic', 'denim'] as GarmentPattern[]).map((pat) => (
                  <BevelButton
                    key={pat}
                    title={pat.toUpperCase()}
                    variant={pattern === pat ? 'cyan' : 'gray'}
                    size="sm"
                    active={pattern === pat}
                    onPress={() => setPattern(pat)}
                    style={styles.categoryBtn}
                  />
                ))}
              </View>
            </View>

            {/* Color Swatches */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>COLOR: {selectedColor.name.toUpperCase()}</Text>
              <View style={styles.swatchRow}>
                {COLOR_PALETTE.map((c) => (
                  <Pressable
                    key={c.hex}
                    onPress={() => {
                      SoundEffects.play('click');
                      setSelectedColor(c);
                    }}
                    style={[
                      styles.swatch,
                      { backgroundColor: c.hex },
                      selectedColor.hex === c.hex && styles.swatchSelected,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Notes / Description */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{userName.toUpperCase()}’S FASHION NOTE:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Where did you get it? What does it pair with?"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={2}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <BevelButton
              title="CANCEL"
              variant="gray"
              size="md"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <BevelButton
              title="💾 SAVE TO WARDROBE"
              variant="green"
              size="md"
              onPress={handleSave}
              style={styles.footerBtn}
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
    padding: 12,
  },
  windowFrame: {
    backgroundColor: RetroTheme.colors.winGray,
    borderWidth: 3,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
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
  scrollContent: {
    padding: 12,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  previewBox: {
    width: 110,
    height: 110,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  colorPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPreviewText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  photoButtons: {
    flex: 1,
    gap: 6,
  },
  btnSmall: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    color: '#000000',
  },
  textArea: {
    minHeight: 44,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  categoryBtn: {
    flexGrow: 1,
    minWidth: 64,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#4b5563',
  },
  swatchSelected: {
    borderColor: '#ff1493',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 10,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#808080',
  },
  footerBtn: {
    minWidth: 110,
  },
});
