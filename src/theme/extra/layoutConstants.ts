import {TextStyle, ViewStyle} from 'react-native';

export const FLEX_DIRECTION: Record<string, ViewStyle['flexDirection']> = {
  ROW: 'row',
  COLUMN: 'column',
  ROW_REVERSE: 'row-reverse',
  COLUMN_REVERSE: 'column-reverse',
};

export const JUSTIFY_CONTENT: Record<string, ViewStyle['justifyContent']> = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
};

export const ALIGN_ITEMS: Record<string, ViewStyle['alignItems']> = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  STRETCH: 'stretch',
  BASELINE: 'baseline',
};

export const TEXT_ALIGN: Record<string, TextStyle['textAlign']> = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
};

export const POSITION: Record<string, ViewStyle['position']> = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
};

export const Z_INDEX = {
  DEFAULT: 1,
  ABOVE: 10,
  BELOW: -1,
};

export const SPACING = {
  NONE: 0,
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
};

export const RADIUS = {
  XS: 4,
  SM: 6,
  MD: 10,
  LG: 16,
  XL: 24,
  PILL: 999,
};

export const FONT_SIZE = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18,
  XXL: 22,
  HUGE: 28,
};

export const LINE_HEIGHT = {
  SM: 16,
  MD: 20,
  LG: 24,
  XL: 28,
  XXL: 32,
};

export const WIDTH = {
  FULL: '100%',
  HALF: '50%',
  AUTO: 'auto',
};

export const HEIGHT = {
  FULL: '100%',
  AUTO: 'auto',
  SCREEN_HEADER: 60,
};

export const GAP = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
};
