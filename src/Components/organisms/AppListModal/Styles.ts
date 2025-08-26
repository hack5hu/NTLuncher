import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    paddingTop: 40,
    paddingHorizontal: 12,
    elevation: 5,
    flex: 1,
    zIndex: 10,
  },
  searchInput: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#111111',
  },
  rename: {
    width: '60%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'red',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  textStyle: {
    fontWeight: '600',
    padding: 5,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
});
