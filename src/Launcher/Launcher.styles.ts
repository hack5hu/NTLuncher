import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  dateTimeContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
});
