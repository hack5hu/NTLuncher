export const ALIGN_ITEMS_VALUE = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  STRETCH: 'stretch',
  BASELINE: 'baseline',
} as const;

export type AlignItemsType =
  (typeof ALIGN_ITEMS_VALUE)[keyof typeof ALIGN_ITEMS_VALUE];

export const ALIGN_ITEMS = {
  START: {alignItems: ALIGN_ITEMS_VALUE.START},
  CENTER: {alignItems: ALIGN_ITEMS_VALUE.CENTER},
  END: {alignItems: ALIGN_ITEMS_VALUE.END},
  STRETCH: {alignItems: ALIGN_ITEMS_VALUE.STRETCH},
  BASELINE: {alignItems: ALIGN_ITEMS_VALUE.BASELINE},
} as const;
