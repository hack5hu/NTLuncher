import {StyleSheet} from 'react-native';
import {LauncherThemes} from '../../../theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: LauncherThemes.Light.transparent,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: LauncherThemes.Light.transparent,
    paddingHorizontal: 12,
    flex: 1,
    zIndex: 10,
  },
  dragHandle: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LauncherThemes.Light.touchTargetTransparent,
  },
  hiddenAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  hiddenAppsText: {
    fontSize: 13,
  },
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
  },
  webSearchButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  webSearchText: {
    fontSize: 14,
    fontWeight: '500',
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
