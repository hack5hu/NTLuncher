export const FlexDirection = {
  ROW: 'row' as const,
  COLUMN: 'column' as const,
  ROW_REVERSE: 'row-reverse',
  COLUMN_REVERSE: 'column-reverse',
};

export const JustifyContent = {
  START: 'flex-start' as const,
  END: 'flex-end' as const,
  CENTER: 'center' as const,
  BETWEEN: 'space-between' as const,
  AROUND: 'space-around' as const,
  EVENLY: 'space-evenly' as const,
};

export const AlignItems = {
  START: 'flex-start' as const,
  END: 'flex-end' as const,
  CENTER: 'center' as const,
  STRETCH: 'stretch' as const,
  BASELINE: 'baseline' as const,
};
