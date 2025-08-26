// import {Dimensions, PixelRatio, Platform} from 'react-native';

// // --- 1. Screen Setup
// const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// const BASE_WIDTH = 414; // iPhone 11 Pro Max
// const BASE_HEIGHT = 896;

// const horizontalScale = SCREEN_WIDTH / BASE_WIDTH;
// const verticalScale = SCREEN_HEIGHT / BASE_HEIGHT;

// const moderateScale = (size: number, factor = 0.5) =>
//   size + (horizontalScale * size - size) * factor;

// export const responsiveWidth = (value: number) =>
//   Math.round(value * horizontalScale);

// export const responsiveHeight = (value: number) =>
//   Math.round(value * verticalScale);

// export const responsiveSize = (value: number, factor = 0.5) =>
//   Math.round(moderateScale(value, factor));

// --- 2. Flex Utilities
// export const FlexDirection = {
//   ROW: 'row' as const,
//   COLUMN: 'column' as const,
// };

// export const JustifyContent = {
//   START: 'flex-start' as const,
//   END: 'flex-end' as const,
//   CENTER: 'center' as const,
//   BETWEEN: 'space-between' as const,
//   AROUND: 'space-around' as const,
//   EVENLY: 'space-evenly' as const,
// };

// export const AlignItems = {
//   START: 'flex-start' as const,
//   END: 'flex-end' as const,
//   CENTER: 'center' as const,
//   STRETCH: 'stretch' as const,
//   BASELINE: 'baseline' as const,
// };

// --- 3. Spacing Helpers
// const BASE_SPACING = 8;

// export const Spacing = {
//   XS: responsiveSize(BASE_SPACING * 0.5),
//   SM: responsiveSize(BASE_SPACING),
//   MD: responsiveSize(BASE_SPACING * 2),
//   LG: responsiveSize(BASE_SPACING * 3),
//   XL: responsiveSize(BASE_SPACING * 4),
//   XXL: responsiveSize(BASE_SPACING * 5),
// };

// export const Margin = {
//   ALL: (v: number) => ({margin: responsiveSize(v)}),
//   V: (v: number) => ({marginVertical: responsiveSize(v)}),
//   H: (v: number) => ({marginHorizontal: responsiveSize(v)}),
//   T: (v: number) => ({marginTop: responsiveSize(v)}),
//   B: (v: number) => ({marginBottom: responsiveSize(v)}),
//   L: (v: number) => ({marginLeft: responsiveSize(v)}),
//   R: (v: number) => ({marginRight: responsiveSize(v)}),
// };

// export const Padding = {
//   ALL: (v: number) => ({padding: responsiveSize(v)}),
//   V: (v: number) => ({paddingVertical: responsiveSize(v)}),
//   H: (v: number) => ({paddingHorizontal: responsiveSize(v)}),
//   T: (v: number) => ({paddingTop: responsiveSize(v)}),
//   B: (v: number) => ({paddingBottom: responsiveSize(v)}),
//   L: (v: number) => ({paddingLeft: responsiveSize(v)}),
//   R: (v: number) => ({paddingRight: responsiveSize(v)}),
// };

// --- 4. Gap
// export const Gap = {
//   XS: Spacing.XS,
//   SM: Spacing.SM,
//   MD: Spacing.MD,
//   LG: Spacing.LG,
//   XL: Spacing.XL,
// };

// --- 5. Typography
// const BASE_FONT = Platform.OS === 'ios' ? 16 : 15;

// export const FontSize = {
//   XS: responsiveSize(BASE_FONT * 0.75),
//   SM: responsiveSize(BASE_FONT * 0.875),
//   MD: responsiveSize(BASE_FONT),
//   LG: responsiveSize(BASE_FONT * 1.25),
//   XL: responsiveSize(BASE_FONT * 1.5),
//   XXL: responsiveSize(BASE_FONT * 2),
// };

// export const FontWeight = {
//   REGULAR: '400' as const,
//   MEDIUM: '500' as const,
//   SEMI_BOLD: '600' as const,
//   BOLD: '700' as const,
// };

// --- 6. Border Radius
// export const BorderRadius = {
//   XS: responsiveSize(2),
//   SM: responsiveSize(4),
//   MD: responsiveSize(8),
//   LG: responsiveSize(16),
//   XL: responsiveSize(32),
// };

// --- 7. Elevation / Shadows
// export const Elevation = {
//   NONE: 0,
//   SM: 2,
//   MD: 4,
//   LG: 6,
// };

// export const Shadow = {
//   IOS: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   ANDROID: {
//     elevation: Elevation.MD,
//   },
// };

// --- 8. Positioning Helpers
// export const Position = {
//   ABSOLUTE_FILL: {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   RELATIVE: {
//     position: 'relative' as const,
//   },
// };

// --- 9. Width/Height Shortcuts
// export const Size = {
//   FULL_WIDTH: {
//     width: '100%' as const,
//   },
//   FULL_HEIGHT: {
//     height: '100%' as const,
//   },
//   HALF_WIDTH: {
//     width: '50%' as const,
//   },
//   HALF_HEIGHT: {
//     height: '50%' as const,
//   },
//   SQUARE: (size: number) => ({
//     width: responsiveSize(size),
//     height: responsiveSize(size),
//   }),
// };


// 9. Example StyleSheet Usage
/**
import { StyleSheet } from 'react-native';
import {
  FlexDirection,
  JustifyContent,
  AlignItems,
  Spacing,
  Margin,
  Padding,
  FontSize,
  FontWeight,
  BorderRadius,
  Elevation,
  Gap,
} from './theme/responsiveDesign';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: FlexDirection.COLUMN,
    justifyContent: JustifyContent.CENTER,
    alignItems: AlignItems.CENTER,
    backgroundColor: '#FFFFFF',
    ...Padding.ALL(Spacing.MD),
  },
  header: {
    fontSize: FontSize.XL,
    fontWeight: FontWeight.SEMI_BOLD,
    color: '#212529',
    ...Margin.B(Spacing.SM),
  },
  card: {
    width: responsiveWidth(350),
    backgroundColor: '#F8F9FA',
    borderRadius: BorderRadius.MD,
    ...Padding.ALL(Spacing.MD),
    elevation: Elevation.SM,
  },
  buttonRow: {
    flexDirection: FlexDirection.ROW,
    justifyContent: JustifyContent.SPACE_BETWEEN,
    gap: Gap.MD,
    ...Margin.T(Spacing.LG),
  },
  button: {
    flex: 1,
    backgroundColor: '#FFB020',
    borderRadius: BorderRadius.SM,
    ...Padding.V(Spacing.SM),
    ...Padding.H(Spacing.LG),
  },
  buttonText: {
    fontSize: FontSize.MD,
    fontWeight: FontWeight.MEDIUM,
    color: '#FFFFFF',
    textAlign: 'center' as const,
  },
});
*/
