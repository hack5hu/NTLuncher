export const MoonlightTheme = {
  name: 'dark',
  background: '#0F1117',
  surface: '#1A1D23',
  text: {
    primary: '#ECEFF4',
    secondary: '#A3ACB9',
    muted: '#7C8695',
  },
  border: '#2D323B',
  divider: '#3A3F4B',
  input: {
    background: '#1F232A',
    border: '#343A46',
    placeholder: '#6C7380',
  },
  accent: '#8FB9F4',
  accentHover: '#A9CCFF',
  accentGlow: '#BBDFFF',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#38BDF8',
};

export const SunlightTheme = {
  name: 'light',
  background: '#FAF9F6',
  surface: '#FFFFFF',
  text: {
    primary: '#2E3440',
    secondary: '#4C566A',
    muted: '#7A7F8B',
  },
  border: '#E5E7EB',
  divider: '#D1D5DB',
  input: {
    background: '#FFFFFF',
    border: '#D1D5DB',
    placeholder: '#9CA3AF',
  },
  accent: '#2563EB',
  accentHover: '#3B82F6',
  accentGlow: '#60A5FA',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
};
export const MoonlightTheme2 = {
  name: 'dark',
  background: '#121212', // Material Design recommended dark gray instead of pure black
  surface: '#1E1E1E', // Better depth perception and shadows
  text: {
    primary: '#E1E4E8', // Slightly less bright to reduce eye strain
    secondary: '#A3ACB9', // Keep existing - good contrast
    muted: '#7C8695', // Keep existing
  },
  border: '#30363D', // More visible borders
  divider: '#424242', // Better contrast for dividers
  input: {
    background: '#1C1C1C', // Subtle blue tint as recommended
    border: '#383838', // Enhanced visibility
    placeholder: '#6C7380', // Keep existing
  },
  accent: '#FFB020', // Golden amber - perfect for gaming excitement
  accentHover: '#FFCC4D', // Brighter gold on hover
  accentGlow: '#FFD700', // Pure gold glow effect
  success: '#28A745', // Slightly muted green
  warning: '#FFC107', // Consistent with golden theme
  error: '#DC3545', // Standard accessible red
  info: '#17A2B8', // Teal instead of blue
};

export const SunlightTheme2 = {
  name: 'light',
  background: '#FFFFFF', // Pure white for maximum contrast
  surface: '#F8F9FA', // Very light gray for cards/surfaces
  text: {
    primary: '#212529', // Darker text for better contrast
    secondary: '#495057', // Good medium gray
    muted: '#6C757D', // Lighter muted text
  },
  border: '#DEE2E6', // Light but visible borders
  divider: '#CED4DA', // Subtle but clear dividers
  input: {
    background: '#FFFFFF', // Keep white
    border: '#CED4DA', // Consistent styling
    placeholder: '#ADB5BD', // Good contrast
  },
  accent: '#663800', // Dark orange - complements dark theme gold
  accentHover: '#4c2a00', // Darker on hover
  accentGlow: '#FFB84D', // Light golden glow
  success: '#198754', // Dark green
  warning: '#FD7E14', // Orange warning
  error: '#DC3545', // Consistent red across themes
  info: '#0DCAF0', // Light blue info
};

export const MoonlightTheme3 = {
  name: 'dark',
  background: '#121420',
  surface: '#252A34',
  text: {
    primary: '#ECEFF4',
    secondary: '#A3ACB9',
    muted: '#888F9F',
  },
  border: '#343A46',
  divider: '#424A56',
  input: {
    background: '#252A34',
    border: '#3F4854',
    placeholder: '#9CA3AF',
  },
  accent: '#60A5FA',
  accentHover: '#93C5FD',
  accentGlow: '#BFDBFE',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#38BDF8',
};

export const SunlightTheme4 = {
  name: 'light',
  background: '#FAF9F6',
  surface: '#FFFFFF',
  text: {
    primary: '#2E3440',
    secondary: '#4C566A',
    muted: '#6B7280',
  },
  border: '#E5E7EB',
  divider: '#D1D5DB',
  input: {
    background: '#FFFFFF',
    border: '#D1D5DB',
    placeholder: '#6B7280',
  },
  accent: '#1E3A8A',
  accentHover: '#2563EB',
  accentGlow: '#3B82F6',
  success: '#047857',
  warning: '#92400E',
  error: '#B91C1C',
  info: '#0369A1',
};

export interface LauncherColorPalette {
  amoledBg: string;
  shadow: string;
  transparent: string;
  touchTargetTransparent: string;
  backdrop: string;
  wallpaperOverlay: string;
  surface: string;
  card: string;
  floatingCard: string;
  chip: string;
  chipSelected: string;
  chipSelectedText: string;
  textPrimary: string;
  textOnWallpaper: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  inputSubtleBg: string;
  inputPlaceholder: string;
  actionPillBg: string;
  switchTrackOff: string;
  switchTrackOn: string;
  switchThumb: string;
  dangerBg: string;
  dangerText: string;
  primaryButtonBg: string;
  primaryButtonText: string;
}

const SHARED_BASE = {
  amoledBg: '#000000',
  shadow: '#000000',
  transparent: 'transparent',
  touchTargetTransparent: 'rgba(0,0,0,0.01)',
  backdrop: 'rgba(0,0,0,0.45)',
};

const LIGHT_PALETTE: LauncherColorPalette = {
  ...SHARED_BASE,
  wallpaperOverlay: 'rgba(0,0,0,0.15)',
  surface: '#F6F7F9',
  card: '#FFFFFF',
  floatingCard: 'rgba(255, 255, 255, 0.96)',
  chip: '#E5E7EB',
  chipSelected: '#18181B',
  chipSelectedText: '#FFFFFF',
  textPrimary: '#111827',
  textOnWallpaper: '#111111',
  textSecondary: '#6B7280',
  textMuted: 'rgba(17,24,39,0.6)',
  inputBg: 'rgba(255,255,255,0.75)',
  inputSubtleBg: 'rgba(0, 0, 0, 0.06)',
  inputPlaceholder: 'rgba(17,24,39,0.5)',
  actionPillBg: 'rgba(0,0,0,0.08)',
  switchTrackOff: '#D1D5DB',
  switchTrackOn: '#18181B',
  switchThumb: '#FFFFFF',
  dangerBg: '#FEE2E2',
  dangerText: '#DC2626',
  primaryButtonBg: '#18181B',
  primaryButtonText: '#FFFFFF',
};

const DARK_PALETTE: LauncherColorPalette = {
  ...SHARED_BASE,
  wallpaperOverlay: 'rgba(0,0,0,0.35)',
  surface: '#18181B',
  card: '#232329',
  floatingCard: 'rgba(34, 34, 38, 0.96)',
  chip: '#2E2E36',
  chipSelected: '#F3F4F6',
  chipSelectedText: '#111827',
  textPrimary: '#F3F4F6',
  textOnWallpaper: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: 'rgba(243,244,246,0.65)',
  inputBg: 'rgba(255,255,255,0.12)',
  inputSubtleBg: 'rgba(255, 255, 255, 0.1)',
  inputPlaceholder: 'rgba(243,244,246,0.55)',
  actionPillBg: 'rgba(255,255,255,0.12)',
  switchTrackOff: '#3F3F46',
  switchTrackOn: '#E5E7EB',
  switchThumb: '#18181B',
  dangerBg: '#2A1B1D',
  dangerText: '#FCA5A5',
  primaryButtonBg: '#F3F4F6',
  primaryButtonText: '#111827',
};

const AMOLED_PALETTE: LauncherColorPalette = {
  ...DARK_PALETTE,
  wallpaperOverlay: 'rgba(0,0,0,0.45)',
  surface: '#000000',
  card: '#111113',
  chip: '#1E1E22',
};

export const LauncherThemes = {
  Light: LIGHT_PALETTE,
  Dark: DARK_PALETTE,
  Amoled: AMOLED_PALETTE,
} as const;

export const getThemeColors = (themeMode?: unknown): LauncherColorPalette => {
  if (themeMode === 'Amoled') return LauncherThemes.Amoled;
  if (themeMode === 'Dark') return LauncherThemes.Dark;
  return LauncherThemes.Light;
};
