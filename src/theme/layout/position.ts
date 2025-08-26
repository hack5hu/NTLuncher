export const POSITION_VALUE = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
} as const;

export type PositionValueType =
  (typeof POSITION_VALUE)[keyof typeof POSITION_VALUE];

export const POSITION = {
  ABSOLUTE: {position: POSITION_VALUE.ABSOLUTE},
  RELATIVE: {position: POSITION_VALUE.RELATIVE},
} as const;
