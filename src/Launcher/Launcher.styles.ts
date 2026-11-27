import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    paddingBottom: 24,
  },
  dateTimeContainer: {
    position: 'absolute',
    top: 36,
    zIndex: 10,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
});

