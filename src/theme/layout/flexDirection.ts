export const FLEX_DIRECTION_VALUE = {
  ROW: 'row',
  COLUMN: 'column',
  ROW_REVERSE: 'row-reverse',
  COLUMN_REVERSE: 'column-reverse',
} as const;

export type FlexDirectionType =
  (typeof FLEX_DIRECTION_VALUE)[keyof typeof FLEX_DIRECTION_VALUE];

export const FLEX_DIRECTION = {
  ROW: {flexDirection: FLEX_DIRECTION_VALUE.ROW},
  COLUMN: {flexDirection: FLEX_DIRECTION_VALUE.COLUMN},
  ROW_REVERSE: {flexDirection: FLEX_DIRECTION_VALUE.ROW_REVERSE},
  COLUMN_REVERSE: {flexDirection: FLEX_DIRECTION_VALUE.COLUMN_REVERSE},
} as const;
