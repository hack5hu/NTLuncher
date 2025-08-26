export const FLEX_WRAP_VALUE = {
  NOWRAP: 'nowrap',
  WRAP: 'wrap',
  WRAP_REVERSE: 'wrap-reverse',
} as const;

export type FlexWrapType =
  (typeof FLEX_WRAP_VALUE)[keyof typeof FLEX_WRAP_VALUE];

export const FLEX_WRAP = {
  NOWRAP: {flexWrap: FLEX_WRAP_VALUE.NOWRAP},
  WRAP: {flexWrap: FLEX_WRAP_VALUE.WRAP},
  WRAP_REVERSE: {flexWrap: FLEX_WRAP_VALUE.WRAP_REVERSE},
} as const;
