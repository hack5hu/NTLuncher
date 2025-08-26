import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

const horizontalScale = SCREEN_WIDTH / BASE_WIDTH;
const verticalScale = SCREEN_HEIGHT / BASE_HEIGHT;

const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale * size - size) * factor;

export const responsiveWidth = (value: number) =>
  Math.round(value * horizontalScale);
export const responsiveHeight = (value: number) =>
  Math.round(value * verticalScale);

export const responsiveSize = (value: number, factor = 0.5) =>
  Math.round(moderateScale(value, factor));