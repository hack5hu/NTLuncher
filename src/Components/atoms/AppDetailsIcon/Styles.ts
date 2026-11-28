import {StyleSheet} from 'react-native';
import {LauncherThemes} from '../../../theme';

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: LauncherThemes.Light.transparent,
  },
  imageIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },
});
