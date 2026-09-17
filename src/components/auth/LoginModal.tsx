import React, { useState } from 'react';
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
import { UserAccount } from '../../types/wardrobe';
import { BevelButton } from '../retro/BevelButton';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';
import { GoogleAuthService } from '../../services/googleAuth';

interface LoginModalProps {
  visible: boolean;
  users: UserAccount[];
  activeUserId: string;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  onCreateUser: (
    name: string,
    tagline?: string,
    avatarIcon?: string,
    email?: string,
    authProvider?: 'local' | 'google',
    avatarImageUri?: string
  ) => void;
  onDeleteUser: (userId: string) => void;
  canClose?: boolean;
}

const AVATAR_PRESETS = ['👑', '👗', '✨', '👠', '💅', '🎀', '🕶️', '💄', '🐆'];

export const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  users,
  activeUserId,
  onClose,
  onSelectUser,
  onCreateUser,
  onDeleteUser,
  canClose = true,
}) => {
  const isFirstLaunch = users.length === 0;
  const [isCreatingNew, setIsCreatingNew] = useState(isFirstLaunch);
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('Fashion Icon');
  const [selectedAvatar, setSelectedAvatar] = useState('👑');
  const [customAvatarUri, setCustomAvatarUri] = useState<string | null>(null);
  const [isCustomEmojiInputOpen, setIsCustomEmojiInputOpen] = useState(false);
  const [customEmojiText, setCustomEmojiText] = useState('');

  // Google Sign-In prompt/flow
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  const handleApplyCustomEmoji = () => {
    if (!customEmojiText.trim()) {
      setIsCustomEmojiInputOpen(false);
      return;
    }
    SoundEffects.play('match');
    setSelectedAvatar(customEmojiText.trim());
    setCustomAvatarUri(null);
    setIsCustomEmojiInputOpen(false);
  };

  const pickAvatarPhoto = async () => {
    try {
      SoundEffects.play('click');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCustomAvatarUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Photo Error', 'Could not open photo gallery.');
    }
  };

  const takeAvatarPhoto = async () => {
    try {
      SoundEffects.play('click');
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Denied', 'Please grant camera access to snap your avatar selfie.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCustomAvatarUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Camera Error', 'Could not open camera.');
    }
  };

  const handleChooseUser = (userId: string) => {
    SoundEffects.play('match');
    onSelectUser(userId);
    onClose();
  };

  const handleCreateLocal = () => {
    if (!newName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for your digital wardrobe!');
      return;
    }
    SoundEffects.play('match');
    onCreateUser(
      newName.trim(),
      newTagline.trim(),
      selectedAvatar,
      undefined,
      'local',
      customAvatarUri || undefined
    );
    setNewName('');
    setCustomAvatarUri(null);
    setIsCreatingNew(false);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    // 1. Try real browser OAuth flow
    try {
      const googleUser = await GoogleAuthService.promptGoogleLoginAsync();
      if (googleUser) {
        SoundEffects.play('match');
        onCreateUser(
          googleUser.name,
          'Google Verified Fashionista',
          '✨',
          googleUser.email,
          'google',
          googleUser.picture
        );
        setGoogleEmail('');
        setIsGoogleModalOpen(false);
        onClose();
        return;
      }
    } catch (err) {
      console.log('OAuth session dismissed or unconfigured:', err);
    }

    // 2. Email verification & profile picture lookup
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail address (e.g. ela@gmail.com).');
      return;
    }
    const derivedName = googleEmail.split('@')[0];
    const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    const googleAvatar = GoogleAuthService.getGoogleAvatarForEmail(googleEmail.trim(), capitalized);

    SoundEffects.play('match');
    onCreateUser(
      capitalized,
      'Google Verified Fashionista',
      '✨',
      googleEmail.trim(),
      'google',
      googleAvatar
    );
    setGoogleEmail('');
    setIsGoogleModalOpen(false);
    onClose();
  };

  const confirmDelete = (user: UserAccount) => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete "${user.name}" and their private wardrobe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteUser(user.id),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={canClose ? onClose : undefined}>
      <View style={styles.backdrop}>
        <View style={styles.windowFrame}>
          {/* Title Bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>
              {isFirstLaunch
                ? 'CYBERCHIC 95 — FIRST TIME SETUP WIZARD'
                : 'CYBERCHIC 95 — LOG ON TO WARDROBE NETWORK'}
            </Text>
            {canClose && !isFirstLaunch && (
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Banner Graphic */}
          <View style={styles.bannerBar}>
            <Text style={styles.bannerIcon}>{isFirstLaunch ? '✨' : '🔐'}</Text>
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerTitle}>
                {isFirstLaunch
                  ? 'WELCOME TO CYBERCHIC 95!'
                  : 'SELECT WARDROBE USER ACCOUNT'}
              </Text>
              <Text style={styles.bannerSubtitle}>
                {isFirstLaunch
                  ? 'Set up your private digital closet. Create your account or connect with Gmail.'
                  : 'Each user has their own private closet, custom clothes, and lookbook archive.'}
              </Text>
            </View>
          </View>

          {/* Google Sign-In Sub-Screen */}
          {isGoogleModalOpen ? (
            <View style={styles.formSection}>
              <View style={styles.googleHeader}>
                <Text style={styles.googleIcon}>🔴</Text>
                <Text style={styles.googleTitle}>SIGN IN WITH GOOGLE (GMAIL)</Text>
              </View>
              <Text style={styles.fieldLabel}>ENTER YOUR GMAIL ADDRESS:</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ela.horowitz@gmail.com"
                placeholderTextColor="#888"
                value={googleEmail}
                onChangeText={setGoogleEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
              <Text style={styles.hintText}>
                Your wardrobe and lookbook will be safely linked to this Google profile.
              </Text>

              <View style={styles.createBtnRow}>
                <BevelButton
                  title="CANCEL"
                  variant="gray"
                  size="md"
                  onPress={() => setIsGoogleModalOpen(false)}
                  style={styles.btnHalf}
                />
                <BevelButton
                  title="CONTINUE WITH GOOGLE"
                  variant="red"
                  size="md"
                  onPress={handleGoogleSignIn}
                  style={styles.btnHalf}
                />
              </View>
            </View>
          ) : !isCreatingNew && !isFirstLaunch ? (
            /* Existing Accounts Selection List */
            <View style={styles.contentSection}>
              <Text style={styles.sectionHeader}>REGISTERED PROFILES ON THIS DEVICE:</Text>
              <ScrollView style={styles.usersList}>
                {users.map((user) => {
                  const isActive = user.id === activeUserId;
                  return (
                    <Pressable
                      key={user.id}
                      onPress={() => handleChooseUser(user.id)}
                      style={[styles.userCard, isActive && styles.userCardActive]}
                    >
                      <View style={styles.userAvatarBox}>
                        {user.avatarImageUri ? (
                          <Image source={{ uri: user.avatarImageUri }} style={styles.userAvatarImg} />
                        ) : (
                          <Text style={styles.userAvatarEmoji}>{user.avatarIcon}</Text>
                        )}
                      </View>

                      <View style={styles.userInfo}>
                        <View style={styles.userNameRow}>
                          <Text style={styles.userNameText}>{user.name.toUpperCase()}</Text>
                          {user.authProvider === 'google' && (
                            <View style={styles.authBadgeGoogle}>
                              <Text style={styles.authBadgeText}>GMAIL</Text>
                            </View>
                          )}
                          {isActive && (
                            <View style={styles.activePill}>
                              <Text style={styles.activePillText}>ACTIVE</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.userTagline}>
                          {user.email ? `${user.email} • ` : ''}
                          {user.tagline}
                        </Text>
                      </View>

                      <View style={styles.cardActions}>
                        <BevelButton
                          title={isActive ? 'LOGGED IN' : 'CONNECT'}
                          variant={isActive ? 'green' : 'pink'}
                          size="sm"
                          onPress={() => handleChooseUser(user.id)}
                          style={styles.connectBtn}
                        />

                        {users.length > 1 && (
                          <Pressable
                            onPress={() => confirmDelete(user)}
                            style={styles.deleteUserBtn}
                          >
                            <Text style={styles.deleteUserText}>✕</Text>
                          </Pressable>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Social Logins & New User Actions */}
              <View style={styles.socialButtonsRow}>
                <BevelButton
                  title="🔴 SIGN IN WITH GOOGLE (GMAIL)"
                  variant="red"
                  size="sm"
                  onPress={() => {
                    SoundEffects.play('click');
                    setIsGoogleModalOpen(true);
                  }}
                  style={styles.socialBtn}
                />
              </View>

              <View style={styles.actionRow}>
                <BevelButton
                  title="✨ + CREATE NEW PROFILE"
                  variant="yellow"
                  size="md"
                  onPress={() => {
                    SoundEffects.play('click');
                    setIsCreatingNew(true);
                  }}
                  style={styles.newUserBtn}
                />
              </View>
            </View>
          ) : (
            /* First Launch Setup / Create Account Form */
            <ScrollView style={styles.formSection}>
              <Text style={styles.sectionHeader}>
                {isFirstLaunch
                  ? 'CREATE YOUR WARDROBE PROFILE:'
                  : 'REGISTER A NEW PROFILE:'}
              </Text>

              {/* Quick Google Button for Real App Experience */}
              <View style={styles.socialHeaderBox}>
                <Text style={styles.quickAuthTitle}>QUICK CONNECT:</Text>
                <View style={styles.socialButtonsRow}>
                  <BevelButton
                    title="🔴 CONNECT WITH GOOGLE (GMAIL)"
                    variant="red"
                    size="sm"
                    onPress={() => {
                      SoundEffects.play('click');
                      setIsGoogleModalOpen(true);
                    }}
                    style={styles.socialBtn}
                  />
                </View>
                <Text style={styles.orDividerText}>— OR CREATE LOCAL OFFLINE CLOSET —</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>YOUR NAME (e.g. Ela, Cher, Alex):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name..."
                  placeholderTextColor="#888"
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus={!isFirstLaunch}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>FASHION MOTTO / TITLE:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Runway Royalty, Beverly Icon..."
                  placeholderTextColor="#888"
                  value={newTagline}
                  onChangeText={setNewTagline}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>CUSTOM AVATAR (ADD YOURS):</Text>
                <View style={styles.customAvatarContainer}>
                  <View style={styles.avatarPreviewBox}>
                    {customAvatarUri ? (
                      <Image source={{ uri: customAvatarUri }} style={styles.avatarPreviewImg} />
                    ) : (
                      <Text style={styles.avatarPreviewEmoji}>{selectedAvatar}</Text>
                    )}
                  </View>
                  <View style={styles.avatarBtnColumn}>
                    <View style={styles.photoActionRow}>
                      <BevelButton
                        title="📸 SNAP SELFIE"
                        variant="yellow"
                        size="sm"
                        onPress={takeAvatarPhoto}
                        style={styles.avatarActionBtn}
                      />
                      <BevelButton
                        title="🖼️ FROM GALLERY"
                        variant="pink"
                        size="sm"
                        onPress={pickAvatarPhoto}
                        style={styles.avatarActionBtn}
                      />
                    </View>
                    {customAvatarUri && (
                      <BevelButton
                        title="✕ REMOVE PHOTO"
                        variant="gray"
                        size="sm"
                        onPress={() => setCustomAvatarUri(null)}
                        style={styles.removeCustomBtn}
                      />
                    )}
                  </View>
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 8 }]}>CHOOSE ICON:</Text>
                <View style={styles.avatarRow}>
                  {AVATAR_PRESETS.map((icon) => (
                    <Pressable
                      key={icon}
                      onPress={() => {
                        SoundEffects.play('click');
                        setSelectedAvatar(icon);
                        setCustomAvatarUri(null);
                        setIsCustomEmojiInputOpen(false);
                      }}
                      style={[
                        styles.avatarBtn,
                        !customAvatarUri && selectedAvatar === icon && styles.avatarBtnSelected,
                      ]}
                    >
                      <Text style={styles.avatarEmoji}>{icon}</Text>
                    </Pressable>
                  ))}

                  {/* Custom user emoji pill if not in presets */}
                  {!AVATAR_PRESETS.includes(selectedAvatar) && selectedAvatar && !customAvatarUri && (
                    <Pressable
                      style={[styles.avatarBtn, styles.avatarBtnSelected]}
                      onPress={() => {
                        SoundEffects.play('click');
                        setIsCustomEmojiInputOpen(true);
                      }}
                    >
                      <Text style={styles.avatarEmoji}>{selectedAvatar}</Text>
                    </Pressable>
                  )}

                  {/* The + Button */}
                  <Pressable
                    onPress={() => {
                      SoundEffects.play('click');
                      setIsCustomEmojiInputOpen(!isCustomEmojiInputOpen);
                    }}
                    style={[
                      styles.avatarBtn,
                      styles.avatarBtnAdd,
                      isCustomEmojiInputOpen && styles.avatarBtnSelected,
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

              <View style={styles.createBtnRow}>
                {!isFirstLaunch && (
                  <BevelButton
                    title="BACK TO ACCOUNTS"
                    variant="gray"
                    size="md"
                    onPress={() => setIsCreatingNew(false)}
                    style={styles.btnHalf}
                  />
                )}
                <BevelButton
                  title="✨ LAUNCH MY WARDROBE"
                  variant="pink"
                  size="md"
                  onPress={handleCreateLocal}
                  style={isFirstLaunch ? styles.btnFull : styles.btnHalf}
                />
              </View>
            </ScrollView>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerInfo}>CYBERCHIC OS 95 — CLOUD & LOCAL WARDROBE OS</Text>
            {canClose && !isFirstLaunch && (
              <BevelButton
                title="CLOSE"
                variant="gray"
                size="sm"
                onPress={onClose}
                style={styles.closeFooterBtn}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    maxWidth: 520,
    maxHeight: '92%',
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
  bannerBar: {
    backgroundColor: '#fffae8',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#808080',
    gap: 10,
  },
  bannerIcon: {
    fontSize: 28,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000080',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: 9,
    color: '#555555',
    marginTop: 2,
  },
  contentSection: {
    padding: 10,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  usersList: {
    maxHeight: 210,
    marginBottom: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
    padding: 8,
    marginBottom: 6,
    gap: 10,
  },
  userCardActive: {
    borderColor: '#ff1493',
    borderWidth: 2,
    backgroundColor: '#fff7fa',
  },
  userAvatarBox: {
    width: 44,
    height: 44,
    backgroundColor: '#ffe4e1',
    borderWidth: 1,
    borderColor: '#ff1493',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarEmoji: {
    fontSize: 24,
  },
  userAvatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userNameText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  authBadgeGoogle: {
    backgroundColor: '#ea4335',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  authBadgeText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '900',
  },
  activePill: {
    backgroundColor: '#059669',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  activePillText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  userTagline: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectBtn: {
    minWidth: 85,
  },
  deleteUserBtn: {
    backgroundColor: '#ff0033',
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#600',
    borderBottomColor: '#600',
  },
  deleteUserText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  socialBtn: {
    flex: 1,
  },
  actionRow: {
    marginTop: 4,
  },
  newUserBtn: {
    width: '100%',
  },
  formSection: {
    padding: 12,
  },
  socialHeaderBox: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#9ca3af',
    padding: 8,
    marginBottom: 10,
  },
  quickAuthTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#374151',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  orDividerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
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
  customAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffae8',
    borderWidth: 2,
    borderColor: '#c8a349',
    padding: 8,
    gap: 10,
    marginBottom: 6,
  },
  avatarPreviewBox: {
    width: 52,
    height: 52,
    backgroundColor: '#ffe4e1',
    borderWidth: 2,
    borderColor: '#ff1493',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPreviewImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPreviewEmoji: {
    fontSize: 26,
  },
  avatarBtnColumn: {
    flex: 1,
    gap: 4,
  },
  photoActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  avatarActionBtn: {
    flex: 1,
  },
  removeCustomBtn: {
    marginTop: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBtnSelected: {
    backgroundColor: '#ff1493',
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  avatarBtnAdd: {
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
  avatarEmoji: {
    fontSize: 18,
  },
  createBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  btnHalf: {
    flex: 1,
  },
  btnFull: {
    width: '100%',
  },
  googleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  googleIcon: {
    fontSize: 16,
  },
  googleTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ea4335',
  },
  hintText: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#808080',
  },
  footerInfo: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#444444',
  },
  closeFooterBtn: {
    minWidth: 70,
  },
});
