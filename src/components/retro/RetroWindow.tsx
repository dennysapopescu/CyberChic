import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Image } from 'react-native';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';

interface RetroWindowProps {
  title?: string;
  subtitle?: string;
  userAvatar?: string;
  userAvatarImageUri?: string;
  userName?: string;
  onOpenProfile?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  statusText?: string;
  children: React.ReactNode;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title = "MY WARDROBE",
  subtitle = '[FALL FASHIONS]',
  userAvatar = '👑',
  userAvatarImageUri,
  userName = 'USER',
  onOpenProfile,
  onClose,
  onMinimize,
  onMaximize,
  statusText = 'READY — 90s CYBERCHIC WARDROBE SYSTEM',
  children,
}) => {
  const handleControlPress = (action?: () => void) => {
    SoundEffects.play('click');
    action?.();
  };

  return (
    <View style={styles.outerFrame}>
      {/* 90s Title Bar */}
      <View style={styles.titleBar}>
        <View style={styles.titleLeft}>
          <Pressable
            style={styles.appIconBox}
            onPress={() => {
              SoundEffects.play('click');
              onOpenProfile?.();
            }}
          >
            {userAvatarImageUri ? (
              <Image source={{ uri: userAvatarImageUri }} style={styles.appIconImage} />
            ) : (
              <Text style={styles.appIconText}>{userAvatar}</Text>
            )}
          </Pressable>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
        </View>

        {/* User Badge Button */}
        {onOpenProfile && (
          <Pressable
            style={styles.userBadgeBtn}
            onPress={() => {
              SoundEffects.play('click');
              onOpenProfile();
            }}
          >
            <Text style={styles.userBadgeText}>👤 {userName.toUpperCase()}</Text>
          </Pressable>
        )}

        {/* Window Control Buttons */}
        <View style={styles.controlsRow}>
          <Pressable
            style={styles.winControlBtn}
            onPress={() => handleControlPress(onMinimize)}
          >
            <Text style={styles.winControlText}>_</Text>
          </Pressable>
          <Pressable
            style={styles.winControlBtn}
            onPress={() => handleControlPress(onMaximize)}
          >
            <Text style={styles.winControlText}>□</Text>
          </Pressable>
          <Pressable
            style={[styles.winControlBtn, styles.closeBtn]}
            onPress={() => handleControlPress(onClose)}
          >
            <Text style={[styles.winControlText, styles.closeBtnText]}>✕</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Window Body */}
      <View style={styles.innerBody}>
        {children}
      </View>

      {/* 90s Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusSectionLeft}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        <View style={styles.statusSectionRight}>
          <Text style={styles.statusMetaText}>640x480 256C</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    backgroundColor: RetroTheme.colors.winGray,
    borderWidth: 3,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 2,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  titleBar: {
    backgroundColor: '#000080',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIconBox: {
    width: 20,
    height: 20,
    backgroundColor: '#ff1493',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#808080',
    borderBottomColor: '#808080',
  },
  appIconText: {
    fontSize: 11,
  },
  appIconImage: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subtitleText: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 6,
    letterSpacing: 0.8,
  },
  userBadgeBtn: {
    backgroundColor: '#ff1493',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#800040',
    borderBottomColor: '#800040',
    marginRight: 6,
  },
  userBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  winControlBtn: {
    width: 18,
    height: 16,
    backgroundColor: '#c0c0c0',
    borderWidth: 1,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#404040',
    borderBottomColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  winControlText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    lineHeight: 11,
  },
  closeBtn: {
    marginLeft: 2,
  },
  closeBtnText: {
    fontSize: 9,
  },
  innerBody: {
    backgroundColor: '#dcdcdc',
    borderWidth: 2,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    padding: 6,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 1,
    borderTopColor: '#808080',
  },
  statusSectionLeft: {
    flex: 1,
    borderWidth: 1,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 4,
  },
  statusSectionRight: {
    borderWidth: 1,
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusMetaText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#555555',
  },
});
