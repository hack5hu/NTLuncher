export const OVERFLOW_VALUE = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  SCROLL: 'scroll',
} as const;

export type OverflowType = (typeof OVERFLOW_VALUE)[keyof typeof OVERFLOW_VALUE];

export const OVERFLOW = {
  VISIBLE: {overflow: OVERFLOW_VALUE.VISIBLE},
  HIDDEN: {overflow: OVERFLOW_VALUE.HIDDEN},
  SCROLL: {overflow: OVERFLOW_VALUE.SCROLL},
} as const;
