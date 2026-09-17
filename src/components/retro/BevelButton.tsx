import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { RetroTheme } from '../../theme/retroTheme';
import { SoundEffects } from '../../services/soundEffects';

interface BevelButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: 'gray' | 'pink' | 'yellow' | 'cyan' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const BevelButton: React.FC<BevelButtonProps> = ({
  title,
  onPress,
  variant = 'gray',
  size = 'md',
  active = false,
  disabled = false,
  style,
  textStyle,
  children,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    SoundEffects.play('click');
    onPress?.();
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'pink':
        return isPressed || active ? '#e60073' : RetroTheme.colors.cherPink;
      case 'yellow':
        return isPressed || active ? '#e6c300' : RetroTheme.colors.cherYellow;
      case 'cyan':
        return isPressed || active ? '#00b8cc' : RetroTheme.colors.cherCyan;
      case 'green':
        return isPressed || active ? '#00cc44' : RetroTheme.colors.matchGreen;
      case 'red':
        return isPressed || active ? '#cc0029' : RetroTheme.colors.mismatchRed;
      case 'gray':
      default:
        return isPressed || active ? '#b0b0b0' : RetroTheme.colors.winGray;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'pink':
      case 'red':
        return '#ffffff';
      case 'yellow':
      case 'cyan':
      case 'green':
      case 'gray':
      default:
        return '#000000';
    }
  };

  const isInset = isPressed || active;

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.buttonBase,
        styles[`size_${size}`],
        {
          backgroundColor: getBackgroundColor(),
          borderTopColor: isInset ? '#808080' : '#ffffff',
          borderLeftColor: isInset ? '#808080' : '#ffffff',
          borderRightColor: isInset ? '#ffffff' : '#404040',
          borderBottomColor: isInset ? '#ffffff' : '#404040',
          transform: isInset ? [{ translateX: 1 }, { translateY: 1 }] : [],
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {title ? (
        <Text
          style={[
            styles.textBase,
            styles[`textSize_${size}`],
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    userSelect: 'none' as any,
  },
  size_sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 28,
  },
  size_md: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    minHeight: 38,
  },
  size_lg: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 46,
  },
  textBase: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  textSize_sm: {
    fontSize: 11,
  },
  textSize_md: {
    fontSize: 13,
  },
  textSize_lg: {
    fontSize: 15,
  },
});
