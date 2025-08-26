export const Z_INDEX_VALUE = {
  AUTO: 'auto',
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  TEN: 10,
  HUNDRED: 100,
  MAX: 999,
} as const;

export type ZIndexType = (typeof Z_INDEX_VALUE)[keyof typeof Z_INDEX_VALUE];

export const Z_INDEX = {
  AUTO: {zIndex: Z_INDEX_VALUE.AUTO},
  ZERO: {zIndex: Z_INDEX_VALUE.ZERO},
  ONE: {zIndex: Z_INDEX_VALUE.ONE},
  TWO: {zIndex: Z_INDEX_VALUE.TWO},
  TEN: {zIndex: Z_INDEX_VALUE.TEN},
  HUNDRED: {zIndex: Z_INDEX_VALUE.HUNDRED},
  MAX: {zIndex: Z_INDEX_VALUE.MAX},
} as const;
