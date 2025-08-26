import {responsiveSize} from './responsive';

const BASE_SPACING = 8;

export const Spacing = {
  XS: responsiveSize(BASE_SPACING * 0.5),
  SM: responsiveSize(BASE_SPACING),
  MD: responsiveSize(BASE_SPACING * 2),
  LG: responsiveSize(BASE_SPACING * 3),
  XL: responsiveSize(BASE_SPACING * 4),
  XXL: responsiveSize(BASE_SPACING * 5),
};

export const Margin = {
  ALL: (v: number) => ({margin: responsiveSize(v)}),
  V: (v: number) => ({marginVertical: responsiveSize(v)}),
  H: (v: number) => ({marginHorizontal: responsiveSize(v)}),
  T: (v: number) => ({marginTop: responsiveSize(v)}),
  B: (v: number) => ({marginBottom: responsiveSize(v)}),
  L: (v: number) => ({marginLeft: responsiveSize(v)}),
  R: (v: number) => ({marginRight: responsiveSize(v)}),
};

export const Padding = {
  ALL: (v: number) => ({padding: responsiveSize(v)}),
  V: (v: number) => ({paddingVertical: responsiveSize(v)}),
  H: (v: number) => ({paddingHorizontal: responsiveSize(v)}),
  T: (v: number) => ({paddingTop: responsiveSize(v)}),
  B: (v: number) => ({paddingBottom: responsiveSize(v)}),
  L: (v: number) => ({paddingLeft: responsiveSize(v)}),
  R: (v: number) => ({paddingRight: responsiveSize(v)}),
};

export const Gap = {
  XS: Spacing.XS,
  SM: Spacing.SM,
  MD: Spacing.MD,
  LG: Spacing.LG,
  XL: Spacing.XL,
};
