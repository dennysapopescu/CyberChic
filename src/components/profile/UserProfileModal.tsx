import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserProfile } from '../../types/wardrobe';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';

interface UserProfileModalProps {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
  onSwitchUserAccount?: () => void;
}

const AVATAR_OPTIONS = ['👑', '👗', '✨', '👠', '💅', '🎀', '🕶️', '💄', '🐆'];

const TAGLINE_SUGGESTIONS = [
  'Fashion Icon',
  'Total Betty',
  'Beverly Hills Royalty',
  'Ensemble Architect',
  'Couture Connoisseur',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  profile,
  onClose,
  onSave,
  onSwitchUserAccount,
}) => {
  const [name, setName] = useState(profile.name || 'Denny');
  const [tagline, setTagline] = useState(profile.tagline || 'Fashion Icon');
  const [avatarIcon, setAvatarIcon] = useState(profile.avatarIcon || '👑');
  const [avatarImageUri, setAvatarImageUri] = useState<string | null>(profile.avatarImageUri || null);
  const [isCustomEmojiInputOpen, setIsCustomEmojiInputOpen] = useState(false);
  const [customEmojiText, setCustomEmojiText] = useState('');

  const handleApplyCustomEmoji = () => {
    if (!customEmojiText.trim()) {
      setIsCustomEmojiInputOpen(false);
      return;
    }
    SoundEffects.play('match');
    setAvatarIcon(customEmojiText.trim());
    setAvatarImageUri(null);
    setIsCustomEmojiInputOpen(false);
  };

  useEffect(() => {
    if (visible) {
      setName(profile.name || 'Denny');
      setTagline(profile.tagline || 'Fashion Icon');
      setAvatarIcon(profile.avatarIcon || '👑');
      setAvatarImageUri(profile.avatarImageUri || null);
      setIsCustomEmojiInputOpen(false);
    }
  }, [visible, profile]);

  const pickPhoto = async () => {
    try {
      SoundEffects.play('click');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Photo Error', 'Could not access photo gallery.');
    }
  };

  const takePhoto = async () => {
    try {
      SoundEffects.play('click');
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Denied', 'Please grant camera access to snap your avatar photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Camera Error', 'Could not open camera.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name for your personalized wardrobe!');
      return;
    }

    const updated: UserProfile = {
      name: name.trim(),
      tagline: tagline.trim() || 'Fashion Icon',
      avatarIcon,
      avatarImageUri: avatarImageUri || undefined,
      themeColor: profile.themeColor || '#ff1493',
      createdAt: profile.createdAt || Date.now(),
    };

    SoundEffects.play('match');
    onSave(updated);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.windowFrame}>
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>USER PROFILE & IDENTITY CARD — [CONTROL PANEL]</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.body}>
            {/* Retro 90s ID Card / Cyber Badge Preview */}
            <View style={styles.idCardContainer}>
              <View style={styles.idCardHeader}>
                <Text style={styles.idCardHeaderTitle}>★ CYBERCHIC 95 MEMBER PASS ★</Text>
              </View>

              <View style={styles.idCardBody}>
                <View style={styles.avatarBox}>
                  {avatarImageUri ? (
                    <Image source={{ uri: avatarImageUri }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarEmoji}>{avatarIcon}</Text>
                  )}
                </View>

                <View style={styles.idCardInfo}>
                  <Text style={styles.idCardName}>{name.toUpperCase() || 'USER'}</Text>
                  <Text style={styles.idCardTagline}>{tagline.toUpperCase()}</Text>
                  <Text style={styles.idCardSerial}>PASS ID: #CC-95-{name ? name.slice(0, 3).toUpperCase() : 'USR'}-01</Text>
                  <Text style={styles.idCardStatus}>STATUS: AUTHENTICATED VIP</Text>
                </View>
              </View>
            </View>

            {/* Input Form */}
            <View style={styles.formSection}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>YOUR NAME (APPEARS ON WARDROBE & MATCHER):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name (e.g. Denny)"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FASHION TITLE / MOOD:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Total Betty, Beverly Royalty..."
                  placeholderTextColor="#888"
                  value={tagline}
                  onChangeText={setTagline}
                />

                {/* Quick Suggestion Pills */}
                <View style={styles.suggestionRow}>
                  {TAGLINE_SUGGESTIONS.map((sug) => (
                    <Pressable
                      key={sug}
                      onPress={() => {
                        SoundEffects.play('click');
                        setTagline(sug);
                      }}
                      style={[
                        styles.sugPill,
                        tagline === sug && styles.sugPillActive,
                      ]}
                    >
                      <Text style={[styles.sugPillText, tagline === sug && styles.sugPillTextActive]}>
                        {sug}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Avatar Selector with Custom Photo Upload */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>ADD YOUR OWN AVATAR PHOTO / CAMERA:</Text>
                <View style={styles.customPhotoRow}>
                  <BevelButton
                    title="📸 SNAP SELFIE"
                    variant="yellow"
                    size="sm"
                    onPress={takePhoto}
                    style={styles.photoBtn}
                  />
                  <BevelButton
                    title="🖼️ FROM GALLERY"
                    variant="pink"
                    size="sm"
                    onPress={pickPhoto}
                    style={styles.photoBtn}
                  />
                  {avatarImageUri && (
                    <BevelButton
                      title="✕ REMOVE"
                      variant="red"
                      size="sm"
                      onPress={() => setAvatarImageUri(null)}
                      style={styles.removePhotoBtn}
                    />
                  )}
                </View>

                <Text style={[styles.label, { marginTop: 10 }]}>CHOOSE ICON:</Text>
                <View style={styles.avatarRow}>
                  {AVATAR_OPTIONS.map((icon) => (
                    <Pressable
                      key={icon}
                      onPress={() => {
                        SoundEffects.play('click');
                        setAvatarIcon(icon);
                        setAvatarImageUri(null);
                        setIsCustomEmojiInputOpen(false);
                      }}
                      style={[
                        styles.avatarOption,
                        !avatarImageUri && avatarIcon === icon && styles.avatarOptionSelected,
                      ]}
                    >
                      <Text style={styles.avatarOptionText}>{icon}</Text>
                    </Pressable>
                  ))}

                  {/* Custom user emoji pill if not in presets */}
                  {!AVATAR_OPTIONS.includes(avatarIcon) && avatarIcon && !avatarImageUri && (
                    <Pressable
                      style={[styles.avatarOption, styles.avatarOptionSelected]}
                      onPress={() => {
                        SoundEffects.play('click');
                        setIsCustomEmojiInputOpen(true);
                      }}
                    >
                      <Text style={styles.avatarOptionText}>{avatarIcon}</Text>
                    </Pressable>
                  )}

                  {/* The + Button */}
                  <Pressable
                    onPress={() => {
                      SoundEffects.play('click');
                      setIsCustomEmojiInputOpen(!isCustomEmojiInputOpen);
                    }}
                    style={[
                      styles.avatarOption,
                      styles.avatarOptionAdd,
                      isCustomEmojiInputOpen && styles.avatarOptionSelected,
                    ]}
                    accessibilityLabel="Add custom emoji"
                  >
                    <Text style={styles.avatarAddPlus}>＋</Text>
                  </Pressable>
                </View>

                {/* Inline custom emoji input */}
                {isCustomEmojiInputOpen && (
                  <View style={styles.customEmojiBox}>
                    <Text style={styles.customEmojiHint}>TYPE OR PASTE ANY EMOJI (e.g. 🦄, 🍒, 🦋, 🖤):</Text>
                    <View style={styles.customEmojiInputRow}>
                      <TextInput
                        style={styles.customEmojiInput}
                        placeholder="e.g. 🦄"
                        placeholderTextColor="#888"
                        value={customEmojiText}
                        onChangeText={setCustomEmojiText}
                        maxLength={6}
                        autoFocus
                      />
                      <BevelButton
                        title="✓ SET"
                        variant="pink"
                        size="sm"
                        onPress={handleApplyCustomEmoji}
                        style={styles.customEmojiSetBtn}
                      />
                      <BevelButton
                        title="✕"
                        variant="gray"
                        size="sm"
                        onPress={() => setIsCustomEmojiInputOpen(false)}
                        style={styles.customEmojiCloseBtn}
                      />
                    </View>
                  </View>
                )}
              </View>
              {/* Switch User / Account button */}
              {onSwitchUserAccount && (
                <View style={{ marginTop: 8 }}>
                  <BevelButton
                    title="🔄 LOG OFF / SWITCH USER ACCOUNT"
                    variant="yellow"
                    size="sm"
                    onPress={() => {
                      SoundEffects.play('click');
                      onClose();
                      onSwitchUserAccount();
                    }}
                    style={{ width: '100%' }}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <BevelButton
              title="CANCEL"
              variant="gray"
              size="md"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <BevelButton
              title="💾 SAVE IDENTITY"
              variant="pink"
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
  body: {
    padding: 12,
  },
  idCardContainer: {
    backgroundColor: '#fffae8',
    borderWidth: 2,
    borderColor: '#c8a349',
    borderRadius: 4,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  idCardHeader: {
    backgroundColor: '#000080',
    paddingVertical: 4,
    alignItems: 'center',
  },
  idCardHeaderTitle: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  idCardBody: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 60,
    height: 60,
    backgroundColor: '#ffe4e1',
    borderWidth: 2,
    borderColor: '#ff1493',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  customPhotoRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  photoBtn: {
    flex: 1,
    minWidth: 110,
  },
  removePhotoBtn: {
    minWidth: 70,
  },
  idCardInfo: {
    flex: 1,
  },
  idCardName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
  },
  idCardTagline: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ff1493',
    marginTop: 1,
  },
  idCardSerial: {
    fontSize: 9,
    fontFamily: 'Courier New, monospace',
    color: '#4b5563',
    marginTop: 4,
  },
  idCardStatus: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 1,
  },
  formSection: {
    gap: 12,
  },
  fieldGroup: {},
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    color: '#000',
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  sugPill: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#9ca3af',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sugPillActive: {
    backgroundColor: '#fce7f3',
    borderColor: '#ff1493',
  },
  sugPillText: {
    fontSize: 9,
    color: '#374151',
    fontWeight: 'bold',
  },
  sugPillTextActive: {
    color: '#be185d',
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  avatarOption: {
    width: 38,
    height: 38,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOptionSelected: {
    backgroundColor: '#ff1493',
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  avatarOptionAdd: {
    backgroundColor: '#fffae8',
    borderColor: '#c8a349',
  },
  avatarAddPlus: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ff1493',
    lineHeight: 22,
  },
  customEmojiBox: {
    marginTop: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    padding: 6,
  },
  customEmojiHint: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  customEmojiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customEmojiInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#9ca3af',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 16,
    textAlign: 'center',
  },
  customEmojiSetBtn: {
    minWidth: 55,
  },
  customEmojiCloseBtn: {
    minWidth: 35,
  },
  avatarOptionText: {
    fontSize: 18,
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
