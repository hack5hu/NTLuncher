import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
