export const ALIGN_SELF_VALUE = {
  AUTO: 'auto',
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  STRETCH: 'stretch',
  BASELINE: 'baseline',
} as const;

export type AlignSelfType =
  (typeof ALIGN_SELF_VALUE)[keyof typeof ALIGN_SELF_VALUE];

export const ALIGN_SELF = {
  AUTO: {alignSelf: ALIGN_SELF_VALUE.AUTO},
  START: {alignSelf: ALIGN_SELF_VALUE.START},
  CENTER: {alignSelf: ALIGN_SELF_VALUE.CENTER},
  END: {alignSelf: ALIGN_SELF_VALUE.END},
  STRETCH: {alignSelf: ALIGN_SELF_VALUE.STRETCH},
  BASELINE: {alignSelf: ALIGN_SELF_VALUE.BASELINE},
} as const;
