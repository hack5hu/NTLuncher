export const TEXT_TRANSFORM_VALUE = {
  NONE: 'none',
  CAPITALIZE: 'capitalize',
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
} as const;

export type TextTransformType =
  (typeof TEXT_TRANSFORM_VALUE)[keyof typeof TEXT_TRANSFORM_VALUE];

export const TEXT_TRANSFORM = {
  NONE: {textTransform: TEXT_TRANSFORM_VALUE.NONE},
  CAPITALIZE: {textTransform: TEXT_TRANSFORM_VALUE.CAPITALIZE},
  UPPERCASE: {textTransform: TEXT_TRANSFORM_VALUE.UPPERCASE},
  LOWERCASE: {textTransform: TEXT_TRANSFORM_VALUE.LOWERCASE},
} as const;
