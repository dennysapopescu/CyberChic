export const RetroTheme = {
  colors: {
    // 90s OS Bevel & Window Palette
    winGray: '#c0c0c0',
    winLight: '#ffffff',
    winDark: '#808080',
    winBlack: '#000000',
    winBackground: '#c3c7cb',
    titleBarBlue: '#000080',
    titleBarActive: '#08216b',
    titleBarText: '#ffffff',

    // Cher Horowitz Beverly Hills Palette
    cherPink: '#ff1493',
    cherHotPink: '#ff3399',
    cherSoftPink: '#ffb6c1',
    cherYellow: '#ffe600',
    cherPlaidYellow: '#ffdb15',
    cherPlaidDark: '#1e1c14',
    cherPlaidRed: '#c8102e',
    cherPlaidBlue: '#15477a',
    cherTeal: '#008080',
    cherCyan: '#00f7ff',
    cherPurple: '#9370db',

    // CRT & Hardware Palette
    crtBeige: '#ded6c7',
    crtBeigeDark: '#bcb3a2',
    crtScreenBg: '#121316',
    crtGlassHighlight: 'rgba(255, 255, 255, 0.08)',
    scanlineColor: 'rgba(0, 0, 0, 0.25)',

    // Verdict alerts
    matchGreen: '#00ff66',
    matchGreenBg: '#053316',
    matchGreenBorder: '#00e65c',
    mismatchRed: '#ff1744',
    mismatchRedBg: '#3b000b',
    mismatchRedBorder: '#ff3366',

    // Text colors
    retroText: '#000000',
    retroTextMuted: '#555555',
    screenTextGreen: '#39ff14',
    screenTextAmber: '#ffb000',
  },
  typography: {
    titleFont: 'System', // Will pair with uppercase, heavy tracking
    monoFont: 'Courier New, monospace',
    condensedFont: 'Impact, Arial Black, sans-serif',
  },
  shadows: {
    bevelOutset: {
      borderTopColor: '#ffffff',
      borderLeftColor: '#ffffff',
      borderRightColor: '#808080',
      borderBottomColor: '#808080',
      borderWidth: 2,
    },
    bevelInset: {
      borderTopColor: '#808080',
      borderLeftColor: '#808080',
      borderRightColor: '#ffffff',
      borderBottomColor: '#ffffff',
      borderWidth: 2,
    },
  },
};
