import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionTitle: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  optionValue: {
    fontSize: 16,
    color: '#007AFF',
  },
  horizontalPickerContainer: {
    marginTop: 8,
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    marginRight: 10,
  },
  pickerItemSelected: {
    backgroundColor: '#007AFF',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#fff',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerTriggerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pickerListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  pickerOption: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    // textAlign: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
  },
});
