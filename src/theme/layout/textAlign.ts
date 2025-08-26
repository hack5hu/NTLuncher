export const TEXT_ALIGN_VALUE = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
} as const;

export type TextAlignType =
  (typeof TEXT_ALIGN_VALUE)[keyof typeof TEXT_ALIGN_VALUE];

export const TEXT_ALIGN = {
  LEFT: {textAlign: TEXT_ALIGN_VALUE.LEFT},
  CENTER: {textAlign: TEXT_ALIGN_VALUE.CENTER},
  RIGHT: {textAlign: TEXT_ALIGN_VALUE.RIGHT},
  JUSTIFY: {textAlign: TEXT_ALIGN_VALUE.JUSTIFY},
} as const;
