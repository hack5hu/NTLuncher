import {Platform} from 'react-native';

export const Elevation = {
  NONE: 0,
  SM: 2,
  MD: 4,
  LG: 6,
};

export const Shadow = {
  IOS: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  ANDROID: {
    elevation: Elevation.MD,
  },
};
