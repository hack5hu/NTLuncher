import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
    paddingTop: 50,
    paddingHorizontal: 20,
    elevation: 5,
    flex: 1,
    zIndex: 10,
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontWeight: '600',
    padding: 5,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
});
