import {responsiveSize} from './responsive';

export const BorderRadius = {
  XS: responsiveSize(2),
  SM: responsiveSize(4),
  MD: responsiveSize(8),
  LG: responsiveSize(16),
  XL: responsiveSize(32),
};

export const Size = {
  FULL_WIDTH: {width: '100%' as const},
  FULL_HEIGHT: {height: '100%' as const},
  HALF_WIDTH: {width: '50%' as const},
  HALF_HEIGHT: {height: '50%' as const},
  SQUARE: (size: number) => ({
    width: responsiveSize(size),
    height: responsiveSize(size),
  }),
};
