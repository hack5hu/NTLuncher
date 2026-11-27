import {StyleSheet} from 'react-native';
import {LauncherThemes} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: LauncherThemes.Light.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 15,
    marginRight: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 116,
  },
});
