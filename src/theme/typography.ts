import {Platform} from 'react-native';
import {responsiveSize} from './responsive';

const BASE_FONT = Platform.OS === 'ios' ? 16 : 15;

export const FontSize = {
  XS: responsiveSize(BASE_FONT * 0.75),
  SM: responsiveSize(BASE_FONT * 0.875),
  MD: responsiveSize(BASE_FONT),
  LG: responsiveSize(BASE_FONT * 1.25),
  XL: responsiveSize(BASE_FONT * 1.5),
  XXL: responsiveSize(BASE_FONT * 2),
};

export const FontWeight = {
  REGULAR: '400' as const,
  MEDIUM: '500' as const,
  SEMI_BOLD: '600' as const,
  BOLD: '700' as const,
};
