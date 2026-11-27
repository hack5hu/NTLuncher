import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    flex: 1,
    zIndex: 10,
  },
  /**
   * Drag handle strip — sits ABOVE the InputBox.
   * NOT over the FlatList, so it never blocks scrolling.
   * Always claims downward swipes in this region.
   */
  dragHandle: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  hiddenAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  hiddenAppsText: {
    color: '#888888',
    fontSize: 13,
  },
  /**
   * Wraps FlatList — has listPanResponder attached.
   * Only intercepts downward swipes when list is at the top.
   */
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 50,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#888888',
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
    borderRadius: 5,
    marginBottom: 10,
  },
  textStyle: {
    fontWeight: '600',
    padding: 5,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },
});
