export const JUSTIFY_CONTENT_VALUE = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
} as const;

export type JustifyContentType =
  (typeof JUSTIFY_CONTENT_VALUE)[keyof typeof JUSTIFY_CONTENT_VALUE];

export const JUSTIFY_CONTENT = {
  START: {justifyContent: JUSTIFY_CONTENT_VALUE.START},
  CENTER: {justifyContent: JUSTIFY_CONTENT_VALUE.CENTER},
  END: {justifyContent: JUSTIFY_CONTENT_VALUE.END},
  SPACE_BETWEEN: {justifyContent: JUSTIFY_CONTENT_VALUE.SPACE_BETWEEN},
  SPACE_AROUND: {justifyContent: JUSTIFY_CONTENT_VALUE.SPACE_AROUND},
  SPACE_EVENLY: {justifyContent: JUSTIFY_CONTENT_VALUE.SPACE_EVENLY},
} as const;
