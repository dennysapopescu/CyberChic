import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Path, Circle, G, Line, Defs, Pattern, Text as SvgText } from 'react-native-svg';
import { Garment } from '../../types/wardrobe';

interface GarmentIllustrationProps {
  garment: Garment;
  width?: number;
  height?: number;
}

export const GarmentIllustration: React.FC<GarmentIllustrationProps> = ({
  garment,
  width = 240,
  height = 190,
}) => {
  if (garment.imageUri) {
    return (
      <View style={[styles.photoContainer, { width, height }]}>
        <Image
          source={{ uri: garment.imageUri }}
          style={styles.customImage}
          resizeMode="contain"
        />
        <View style={styles.customBadge}>
          <Text style={styles.customBadgeText}>CUSTOM</Text>
        </View>
      </View>
    );
  }

  const renderVector = () => {
    switch (garment.illustrationId) {
      // 1. Cher's Yellow Plaid Blazer
      case 'yellow_plaid_blazer':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Defs>
              <Pattern id="cherPlaid" width="20" height="20" patternUnits="userSpaceOnUse">
                <Rect width="20" height="20" fill="#ffd700" />
                <Line x1="0" y1="10" x2="20" y2="10" stroke="#1a1a1a" strokeWidth="2.5" />
                <Line x1="10" y1="0" x2="10" y2="20" stroke="#1a1a1a" strokeWidth="2.5" />
                <Line x1="0" y1="5" x2="20" y2="5" stroke="#c8102e" strokeWidth="1" />
                <Line x1="5" y1="0" x2="5" y2="20" stroke="#c8102e" strokeWidth="1" />
                <Line x1="0" y1="15" x2="20" y2="15" stroke="#15477a" strokeWidth="0.8" />
                <Line x1="15" y1="0" x2="15" y2="20" stroke="#15477a" strokeWidth="0.8" />
              </Pattern>
            </Defs>
            {/* Blazer Main Body */}
            <Path
              d="M 60 25 L 30 50 L 40 145 L 85 150 L 100 148 L 115 150 L 160 145 L 170 50 L 140 25 Z"
              fill="url(#cherPlaid)"
              stroke="#111"
              strokeWidth="2.5"
            />
            {/* Sleeves */}
            <Path
              d="M 60 25 L 15 75 L 32 140 L 48 135 L 35 65 Z"
              fill="url(#cherPlaid)"
              stroke="#111"
              strokeWidth="2"
            />
            <Path
              d="M 140 25 L 185 75 L 168 140 L 152 135 L 165 65 Z"
              fill="url(#cherPlaid)"
              stroke="#111"
              strokeWidth="2"
            />
            {/* Inner White Blouse V-neck */}
            <Path d="M 80 25 L 100 65 L 120 25 Z" fill="#ffffff" stroke="#ddd" strokeWidth="1" />
            <Line x1="100" y1="35" x2="100" y2="65" stroke="#ccc" strokeWidth="1" />
            {/* Black Velvet Collar / Lapels */}
            <Path
              d="M 65 25 L 100 80 L 100 148 L 94 148 L 82 85 L 60 30 Z"
              fill="#222222"
              stroke="#000"
              strokeWidth="1.5"
            />
            <Path
              d="M 135 25 L 100 80 L 100 148 L 106 148 L 118 85 L 140 30 Z"
              fill="#222222"
              stroke="#000"
              strokeWidth="1.5"
            />
            {/* Gold Buttons */}
            <Circle cx="106" cy="95" r="4" fill="#ffb700" stroke="#b37d00" strokeWidth="1" />
            <Circle cx="106" cy="118" r="4" fill="#ffb700" stroke="#b37d00" strokeWidth="1" />
            <Circle cx="106" cy="138" r="4" fill="#ffb700" stroke="#b37d00" strokeWidth="1" />
            {/* Pocket Flaps */}
            <Rect x="55" y="115" width="28" height="6" rx="2" fill="#222" />
            <Rect x="117" y="115" width="28" height="6" rx="2" fill="#222" />
          </Svg>
        );

      // 2. Cher's Yellow Plaid Skirt
      case 'yellow_plaid_skirt':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Defs>
              <Pattern id="skirtPlaid" width="20" height="20" patternUnits="userSpaceOnUse">
                <Rect width="20" height="20" fill="#ffd700" />
                <Line x1="0" y1="10" x2="20" y2="10" stroke="#1a1a1a" strokeWidth="2.5" />
                <Line x1="10" y1="0" x2="10" y2="20" stroke="#1a1a1a" strokeWidth="2.5" />
                <Line x1="0" y1="5" x2="20" y2="5" stroke="#c8102e" strokeWidth="1" />
                <Line x1="5" y1="0" x2="5" y2="20" stroke="#c8102e" strokeWidth="1" />
                <Line x1="0" y1="15" x2="20" y2="15" stroke="#15477a" strokeWidth="0.8" />
                <Line x1="15" y1="0" x2="15" y2="20" stroke="#15477a" strokeWidth="0.8" />
              </Pattern>
            </Defs>
            {/* Waistband */}
            <Rect x="60" y="20" width="80" height="12" rx="2" fill="#ffd700" stroke="#111" strokeWidth="2" />
            {/* Skirt Body with Knife Pleats */}
            <Path
              d="M 60 32 L 35 135 L 165 135 L 140 32 Z"
              fill="url(#skirtPlaid)"
              stroke="#111"
              strokeWidth="2.5"
            />
            {/* Pleat shadow lines */}
            {[55, 75, 95, 105, 125, 145].map((x, i) => (
              <Line
                key={i}
                x1={60 + i * 13}
                y1="32"
                x2={35 + i * 22}
                y2="135"
                stroke="#000000"
                strokeWidth="1.5"
                opacity="0.6"
              />
            ))}
            {/* Iconic Gold Safety Pin */}
            <G transform="translate(130, 48) rotate(15)">
              <Path
                d="M 0 0 L 22 0 C 26 0 28 6 24 9 L 4 9 C 0 9 0 0 4 0 Z"
                fill="none"
                stroke="#d4af37"
                strokeWidth="2"
              />
              <Circle cx="2" cy="4" r="3" fill="#ffd700" />
            </G>
          </Svg>
        );

      // 3. Alaïa Crimson Party Top
      case 'red_alaia_top':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Path
              d="M 70 25 Q 100 40 130 25 L 145 45 L 135 140 L 65 140 L 55 45 Z"
              fill="#c8102e"
              stroke="#7a0a1c"
              strokeWidth="2.5"
            />
            {/* Straps */}
            <Line x1="72" y1="25" x2="68" y2="40" stroke="#900" strokeWidth="4" />
            <Line x1="128" y1="25" x2="132" y2="40" stroke="#900" strokeWidth="4" />
            {/* Sculpted contour curves */}
            <Path
              d="M 75 55 Q 100 75 125 55"
              fill="none"
              stroke="#ff4d6d"
              strokeWidth="2"
              opacity="0.8"
            />
            <Path
              d="M 80 80 L 80 140"
              fill="none"
              stroke="#7a0a1c"
              strokeWidth="1.5"
            />
            <Path
              d="M 120 80 L 120 140"
              fill="none"
              stroke="#7a0a1c"
              strokeWidth="1.5"
            />
          </Svg>
        );

      // 4. Alaïa Crimson Mini Skirt
      case 'red_alaia_skirt':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Tailored Mini */}
            <Path
              d="M 68 25 L 132 25 L 145 130 L 55 130 Z"
              fill="#c8102e"
              stroke="#7a0a1c"
              strokeWidth="2.5"
            />
            {/* Subtle contour lines */}
            <Line x1="82" y1="25" x2="78" y2="130" stroke="#7a0a1c" strokeWidth="1.5" />
            <Line x1="118" y1="25" x2="122" y2="130" stroke="#7a0a1c" strokeWidth="1.5" />
            <Path d="M 60 125 L 140 125" stroke="#ff4d6d" strokeWidth="1.5" opacity="0.6" />
          </Svg>
        );

      // 5. Argyle Vest & Oxford Blouse
      case 'argyle_vest':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* White Sleeves & Body */}
            <Path
              d="M 50 30 L 20 75 L 35 130 L 50 120 L 40 70 Z"
              fill="#ffffff"
              stroke="#111"
              strokeWidth="2"
            />
            <Path
              d="M 150 30 L 180 75 L 165 130 L 150 120 L 160 70 Z"
              fill="#ffffff"
              stroke="#111"
              strokeWidth="2"
            />
            {/* Crisp Blouse Collar */}
            <Path d="M 75 20 L 100 45 L 85 55 Z" fill="#ffffff" stroke="#111" strokeWidth="1.5" />
            <Path d="M 125 20 L 100 45 L 115 55 Z" fill="#ffffff" stroke="#111" strokeWidth="1.5" />
            {/* Dark Argyle Vest */}
            <Path
              d="M 65 30 L 90 55 L 100 58 L 110 55 L 135 30 L 140 135 L 60 135 Z"
              fill="#1e293b"
              stroke="#111"
              strokeWidth="2.5"
            />
            {/* Argyle Diamonds */}
            <Path d="M 100 65 L 115 85 L 100 105 L 85 85 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <Path d="M 100 105 L 115 125 L 100 145 L 85 125 Z" fill="#ec4899" stroke="#f472b6" strokeWidth="1" />
            {/* Crossed lines */}
            <Line x1="75" y1="65" x2="125" y2="125" stroke="#f8fafc" strokeWidth="1" strokeDasharray="3,3" />
            <Line x1="125" y1="65" x2="75" y2="125" stroke="#f8fafc" strokeWidth="1" strokeDasharray="3,3" />
          </Svg>
        );

      // 6. Black Pleated Skirt
      case 'black_pleated_skirt':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Rect x="65" y="20" width="70" height="12" rx="2" fill="#111827" stroke="#000" strokeWidth="2" />
            <Path
              d="M 65 32 L 40 135 L 160 135 L 135 32 Z"
              fill="#1f2937"
              stroke="#000"
              strokeWidth="2.5"
            />
            {[58, 76, 94, 112, 130, 148].map((x, i) => (
              <Line
                key={i}
                x1={66 + i * 11}
                y1="32"
                x2={42 + i * 20}
                y2="135"
                stroke="#111827"
                strokeWidth="2.5"
              />
            ))}
          </Svg>
        );

      // 7. "AS IF!" Baby Tee
      case 'as_if_tee':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Baby Tee Body */}
            <Path
              d="M 60 30 L 30 55 L 45 75 L 65 65 L 65 130 L 135 130 L 135 65 L 155 75 L 170 55 L 140 30 Z"
              fill="#ffffff"
              stroke="#111"
              strokeWidth="2.5"
            />
            {/* Crew Neck */}
            <Path d="M 80 30 Q 100 45 120 30" fill="none" stroke="#ff1493" strokeWidth="3" />
            {/* Sleeve hems in Pink */}
            <Line x1="30" y1="55" x2="45" y2="75" stroke="#ff1493" strokeWidth="2.5" />
            <Line x1="170" y1="55" x2="155" y2="75" stroke="#ff1493" strokeWidth="2.5" />
            {/* AS IF! Text */}
            <SvgText
              x="100"
              y="98"
              fill="#ff1493"
              fontSize="20"
              fontWeight="900"
              fontFamily="Impact, sans-serif"
              textAnchor="middle"
              stroke="#ffffff"
              strokeWidth="0.5"
            >
              AS IF!
            </SvgText>
          </Svg>
        );

      // 8. 90s Baggy Stonewash Jeans
      case 'baggy_jeans':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Waistband */}
            <Rect x="65" y="15" width="70" height="14" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <Circle cx="100" cy="22" r="3" fill="#d4af37" />
            {/* Jeans Legs */}
            <Path
              d="M 65 29 L 45 140 L 88 140 L 98 75 L 102 75 L 112 140 L 155 140 L 135 29 Z"
              fill="#60a5fa"
              stroke="#1e3a8a"
              strokeWidth="2.5"
            />
            {/* Pockets */}
            <Path d="M 70 35 Q 85 45 88 35" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <Path d="M 130 35 Q 115 45 112 35" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Stonewash fading highlights */}
            <Path
              d="M 60 70 Q 65 110 65 130"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="8"
              opacity="0.5"
              strokeLinecap="round"
            />
            <Path
              d="M 140 70 Q 135 110 135 130"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="8"
              opacity="0.5"
              strokeLinecap="round"
            />
            {/* Rolled cuffs */}
            <Rect x="44" y="132" width="45" height="10" rx="1" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="1.5" />
            <Rect x="111" y="132" width="45" height="10" rx="1" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="1.5" />
          </Svg>
        );

      // 9. Sheer Lilac Blouse
      case 'sheer_lilac_blouse':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Translucent poet sleeves */}
            <Path
              d="M 60 30 Q 10 75 35 130 L 55 125 Q 35 80 65 65 Z"
              fill="#e9d5ff"
              opacity="0.8"
              stroke="#a855f7"
              strokeWidth="1.5"
            />
            <Path
              d="M 140 30 Q 190 75 165 130 L 145 125 Q 165 80 135 65 Z"
              fill="#e9d5ff"
              opacity="0.8"
              stroke="#a855f7"
              strokeWidth="1.5"
            />
            {/* Inner Camisole */}
            <Rect x="75" y="55" width="50" height="75" rx="3" fill="#d8b4fe" />
            {/* Sheer Outer Blouse */}
            <Path
              d="M 65 30 L 135 30 L 135 135 L 65 135 Z"
              fill="#f3e8ff"
              opacity="0.75"
              stroke="#a855f7"
              strokeWidth="2"
            />
            {/* Buttons */}
            <Circle cx="100" cy="55" r="2" fill="#fff" />
            <Circle cx="100" cy="80" r="2" fill="#fff" />
            <Circle cx="100" cy="105" r="2" fill="#fff" />
          </Svg>
        );

      // 10. Silver Holographic Slip Skirt
      case 'silver_slip_skirt':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Path
              d="M 68 25 L 132 25 L 145 135 L 55 135 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            {/* Iridescent shimmer gradient lines */}
            <Path d="M 75 30 L 65 130" stroke="#cbd5e1" strokeWidth="6" opacity="0.6" />
            <Path d="M 100 28 L 95 132" stroke="#ffffff" strokeWidth="8" opacity="0.8" />
            <Path d="M 125 30 L 135 130" stroke="#fbcfe8" strokeWidth="5" opacity="0.5" />
          </Svg>
        );

      // 11. Fluffy Mohair Cardigan
      case 'fluffy_cardigan':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Path
              d="M 55 30 L 15 75 L 35 135 L 55 125 L 45 70 L 60 70 L 60 135 L 140 135 L 140 70 L 155 70 L 145 125 L 165 135 L 185 75 L 145 30 Z"
              fill="#fdfbf7"
              stroke="#e2d9cc"
              strokeWidth="3"
            />
            {/* V-neck */}
            <Path d="M 75 30 L 100 80 L 125 30" fill="none" stroke="#d5c8b5" strokeWidth="2" />
            {/* Buttons */}
            <Circle cx="100" cy="95" r="3" fill="#e5d5c0" stroke="#b09d85" strokeWidth="1" />
            <Circle cx="100" cy="115" r="3" fill="#e5d5c0" stroke="#b09d85" strokeWidth="1" />
          </Svg>
        );

      // 12. Navy Plaid Kilt
      case 'navy_plaid_kilt':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Defs>
              <Pattern id="navyPlaid" width="20" height="20" patternUnits="userSpaceOnUse">
                <Rect width="20" height="20" fill="#1e3a8a" />
                <Line x1="0" y1="10" x2="20" y2="10" stroke="#0f172a" strokeWidth="3" />
                <Line x1="10" y1="0" x2="10" y2="20" stroke="#0f172a" strokeWidth="3" />
                <Line x1="0" y1="5" x2="20" y2="5" stroke="#10b981" strokeWidth="1" />
                <Line x1="5" y1="0" x2="5" y2="20" stroke="#10b981" strokeWidth="1" />
              </Pattern>
            </Defs>
            <Rect x="65" y="20" width="70" height="12" rx="2" fill="#0f172a" />
            <Path
              d="M 65 32 L 40 135 L 160 135 L 135 32 Z"
              fill="url(#navyPlaid)"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Leather buckle */}
            <Rect x="125" y="38" width="14" height="6" fill="#78350f" stroke="#000" strokeWidth="1" />
            <Circle cx="132" cy="41" r="1.5" fill="#ffd700" />
          </Svg>
        );

      // 13. Mary Janes & Knee-Highs
      case 'mary_janes':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* White Knee-High Socks */}
            <Path d="M 60 15 L 85 15 L 82 105 L 57 105 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <Path d="M 115 15 L 140 15 L 143 105 L 118 105 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Black Patent Mary Janes */}
            {/* Left Shoe */}
            <Path
              d="M 52 105 C 50 115 40 120 40 135 C 40 145 92 145 92 135 C 92 120 85 105 85 105 Z"
              fill="#111827"
              stroke="#000"
              strokeWidth="2"
            />
            <Rect x="48" y="112" width="38" height="5" rx="2" fill="#374151" />
            <Circle cx="50" cy="114" r="2" fill="#ffd700" />
            {/* Right Shoe */}
            <Path
              d="M 148 105 C 150 115 160 120 160 135 C 160 145 108 145 108 135 C 108 120 115 105 115 105 Z"
              fill="#111827"
              stroke="#000"
              strokeWidth="2"
            />
            <Rect x="114" y="112" width="38" height="5" rx="2" fill="#374151" />
            <Circle cx="150" cy="114" r="2" fill="#ffd700" />
          </Svg>
        );

      // 14. Red Stilettos
      case 'red_heels':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Left Heel */}
            <Path d="M 50 125 L 85 125 L 75 75 L 65 75 Z" fill="#c8102e" stroke="#900" strokeWidth="1.5" />
            <Line x1="52" y1="125" x2="52" y2="148" stroke="#900" strokeWidth="4" />
            {/* Right Heel */}
            <Path d="M 115 125 L 150 125 L 140 75 L 130 75 Z" fill="#c8102e" stroke="#900" strokeWidth="1.5" />
            <Line x1="148" y1="125" x2="148" y2="148" stroke="#900" strokeWidth="4" />
          </Svg>
        );

      // 15. Platform Sneakers
      case 'platform_sneakers':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Left Sneaker */}
            <Path d="M 40 100 L 90 100 L 92 125 L 35 125 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <Rect x="32" y="125" width="62" height="15" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            {/* Right Sneaker */}
            <Path d="M 110 100 L 160 100 L 165 125 L 108 125 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <Rect x="106" y="125" width="62" height="15" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
          </Svg>
        );

      // 16. Feather Pen
      case 'feather_pen':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Fluffy Feather Puff */}
            <Circle cx="100" cy="50" r="35" fill="#ff69b4" opacity="0.9" />
            <Circle cx="85" cy="40" r="25" fill="#ff85c0" opacity="0.8" />
            <Circle cx="115" cy="45" r="25" fill="#ffb6c1" opacity="0.85" />
            {/* Pen Stem */}
            <Rect x="97" y="75" width="6" height="65" rx="2" fill="#ffd700" stroke="#b37d00" strokeWidth="1" />
            <Path d="M 97 140 L 100 150 L 103 140 Z" fill="#111" />
          </Svg>
        );

      // 17. Heart Choker
      case 'heart_choker':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Velvet Band */}
            <Path d="M 30 70 Q 100 100 170 70" fill="none" stroke="#111827" strokeWidth="16" strokeLinecap="round" />
            {/* Rhinestone Heart */}
            <G transform="translate(100, 85)">
              <Path
                d="M 0 -8 C -12 -22 -24 -2 0 16 C 24 -2 12 -22 0 -8 Z"
                fill="#f8fafc"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <Circle cx="0" cy="2" r="3" fill="#e0f2fe" />
            </G>
          </Svg>
        );

      // 18. Mini Backpack
      case 'mini_backpack':
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            {/* Backpack Body */}
            <Path
              d="M 65 50 C 65 30 135 30 135 50 L 145 130 C 145 140 55 140 55 130 Z"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />
            {/* Front Pocket */}
            <Rect x="75" y="85" width="50" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <Circle cx="100" cy="95" r="4" fill="#ffd700" />
            {/* Straps Handle */}
            <Path d="M 85 30 C 85 15 115 15 115 30" fill="none" stroke="#111" strokeWidth="3" />
          </Svg>
        );

      default:
        // Generic Stylized Garment Card fallback
        return (
          <Svg viewBox="0 0 200 160" width="100%" height="100%">
            <Rect
              x="50"
              y="30"
              width="100"
              height="100"
              rx="12"
              fill={garment.color || '#ff69b4'}
              stroke="#000"
              strokeWidth="2.5"
            />
            <SvgText
              x="100"
              y="85"
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              {garment.category.toUpperCase()}
            </SvgText>
          </Svg>
        );
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {renderVector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#808080',
    overflow: 'hidden',
  },
  customImage: {
    width: '100%',
    height: '100%',
  },
  customBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#ff1493',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
