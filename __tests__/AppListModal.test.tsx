import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Linking, NativeModules, Text, TextInput, TouchableOpacity, View} from 'react-native';
import useAppStore from '../src/Store/AppStore';
import {initialState} from '../src/Store/StoreState';
import {toggleHideApp} from '../src/Store/StoreActions';
import AppListModal from '../src/Components/templates/AppListModal/AppListModal';
import DefaultActionsRow from '../src/Components/molecules/DefaultActionsRow/DefaultActionsRow';
import RenameRow from '../src/Components/molecules/RenameRow/RenameRow';
import {AppItemProps} from '../src/Type';

const mockApps: AppItemProps[] = [
  {label: 'YouTube', packageName: 'com.google.android.youtube', index: 0, isWorkApp: false},
  {label: 'Calendar', packageName: 'com.google.android.calendar', index: 1, isWorkApp: false},
  {label: 'Calendar', packageName: 'com.google.android.calendar', index: 2, isWorkApp: true},
  {label: 'Camera', packageName: 'com.android.camera', index: 3, isHidden: true},
];

const getTextNodes = (root: ReactTestRenderer.ReactTestInstance, text: string) =>
  root.findAll(node => {
    if ((node.type as unknown) !== Text) return false;
    const raw = Array.isArray(node.props.children)
      ? node.props.children.join('')
      : String(node.props.children ?? '');
    return raw.trim() === text || raw.trim().endsWith(text);
  });

const findTouchTargetForText = (
  root: ReactTestRenderer.ReactTestInstance,
  text: string,
) => {
  const textNode = getTextNodes(root, text)[0];
  if (!textNode) throw new Error(`Text "${text}" not found`);
  let curr: ReactTestRenderer.ReactTestInstance | null = textNode.parent;
  while (curr && !curr.props.onPress && !curr.props.onLongPress) {
    curr = curr.parent;
  }
  if (!curr) throw new Error(`Touchable parent for "${text}" not found`);
  return curr;
};

describe('AppListModal & App Actions - Full Coverage & Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      ...initialState,
      apps: [...mockApps],
      homeApps: [
        {label: 'Calendar', packageName: 'com.google.android.calendar', index: 1, isWorkApp: false},
      ],
      settingState: {
        ...initialState.settingState,
        autoShowKeyboard: false,
        autoLaunchSearch: false,
      },
    });
    NativeModules.AppList.getInstalledApps = jest.fn(() =>
      Promise.resolve(JSON.stringify(mockApps)),
    );
    NativeModules.AppList.openAppSettings = jest.fn();
    NativeModules.AppList.uninstallApp = jest.fn(() => Promise.resolve());
    NativeModules.AppList.authenticateUser = jest.fn(() => Promise.resolve(true));
  });

  it('toggleHideApp toggles isHidden on matching packageName', () => {
    const state = useAppStore.getState();
    const next = toggleHideApp('com.google.android.youtube')(state);
    const yt = next.apps.find((a: AppItemProps) => a.packageName === 'com.google.android.youtube');
    expect(yt?.isHidden).toBe(true);
  });

  it('filters out hidden apps by default and keeps work/personal profile apps separate', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal isModalVisible={true} onAppSelect={jest.fn()} closeModal={jest.fn()} />,
      );
      await Promise.resolve();
    });

    expect(getTextNodes(renderer.root, 'Calendar').length).toBe(2);
    expect(getTextNodes(renderer.root, 'Camera').length).toBe(0);
    act(() => renderer.unmount());
  });

  it('handles whitespace search queries case-insensitively and shows empty state', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal isModalVisible={true} onAppSelect={jest.fn()} closeModal={jest.fn()} />,
      );
      await Promise.resolve();
    });

    const searchInput = renderer.root.findByType(TextInput);
    await act(async () => {
      searchInput.props.onChangeText('  YOUTUBE  ');
    });
    expect(getTextNodes(renderer.root, 'YouTube').length).toBe(1);
    expect(getTextNodes(renderer.root, 'Calendar').length).toBe(0);

    await act(async () => {
      searchInput.props.onChangeText('nonexistentapp123');
    });
    expect(getTextNodes(renderer.root, 'No matching apps found').length).toBe(1);
    const openUrlSpy = jest
      .spyOn(Linking, 'openURL')
      .mockImplementation(() => Promise.resolve());
    await act(async () => {
      findTouchTargetForText(
        renderer.root,
        'Search "nonexistentapp123" on Web',
      ).props.onPress();
    });
    expect(openUrlSpy).toHaveBeenCalledWith(
      'https://www.google.com/search?q=nonexistentapp123',
    );
    openUrlSpy.mockRestore();

    // Clear button resets search query
    await act(async () => {
      findTouchTargetForText(renderer.root, '✕').props.onPress();
    });
    expect(getTextNodes(renderer.root, 'YouTube').length).toBe(1);
    act(() => renderer.unmount());
  });

  it('hides View hidden apps button by default and unlocks hidden apps on 2-finger spread after auth', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal isModalVisible={true} onAppSelect={jest.fn()} closeModal={jest.fn()} />,
      );
      await Promise.resolve();
    });

    expect(getTextNodes(renderer.root, 'View hidden apps').length).toBe(0);
    expect(getTextNodes(renderer.root, 'Camera').length).toBe(0);

    // Find listWrapper with panHandlers
    const listWrapper = renderer.root.findByProps({testID: 'list-wrapper'});
    expect(listWrapper).toBeTruthy();

    const makeTwoFingerEvent = (x1: number, x2: number, ts: number) => ({
      touchHistory: {
        touchBank: [
          {touchActive: true, currentPageX: x1, currentPageY: 200, startPageX: x1, startPageY: 200, previousPageX: x1, previousPageY: 200},
          {touchActive: true, currentPageX: x2, currentPageY: 200, startPageX: x2, startPageY: 200, previousPageX: x2, previousPageY: 200},
        ],
        numberActiveTouches: 2,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: ts,
      },
      nativeEvent: {touches: [{pageX: x1, pageY: 200}, {pageX: x2, pageY: 200}]},
    });

    // First test canceled auth -> keeps hidden apps locked
    NativeModules.AppList.authenticateUser = jest.fn(() => Promise.resolve(false));
    await act(async () => {
      listWrapper!.props.onResponderGrant(makeTwoFingerEvent(100, 150, 100));
      await listWrapper!.props.onResponderMove(makeTwoFingerEvent(50, 250, 200));
      await Promise.resolve();
    });
    expect(NativeModules.AppList.authenticateUser).toHaveBeenCalled();
    expect(getTextNodes(renderer.root, 'Camera').length).toBe(0);

    // Now test successful auth -> shows hidden apps and unhides Camera
    NativeModules.AppList.authenticateUser = jest.fn(() => Promise.resolve(true));
    await act(async () => {
      listWrapper!.props.onResponderGrant(makeTwoFingerEvent(100, 150, 300));
      await listWrapper!.props.onResponderMove(makeTwoFingerEvent(50, 250, 400));
      await Promise.resolve();
    });

    expect(getTextNodes(renderer.root, 'Camera').length).toBe(1);
    expect(getTextNodes(renderer.root, 'YouTube').length).toBe(0);

    await act(async () => {
      findTouchTargetForText(renderer.root, 'Camera').props.onLongPress();
    });
    await act(async () => {
      findTouchTargetForText(renderer.root, 'Unhide').props.onPress();
    });
    expect(getTextNodes(renderer.root, 'No hidden apps').length).toBe(1);
    act(() => renderer.unmount());
  });

  it('handles malformed JSON from native getInstalledApps gracefully', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    NativeModules.AppList.getInstalledApps = jest.fn(() =>
      Promise.resolve('{invalid-json'),
    );

    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal isModalVisible={true} onAppSelect={jest.fn()} closeModal={jest.fn()} />,
      );
      await Promise.resolve();
    });

    expect(getTextNodes(renderer.root, 'YouTube').length).toBe(1);
    errSpy.mockRestore();
    act(() => renderer.unmount());
  });

  it('opens actions on long press, renames app, and restores original label on blank rename', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal isModalVisible={true} onAppSelect={jest.fn()} closeModal={jest.fn()} />,
      );
      await Promise.resolve();
    });

    await act(async () => {
      findTouchTargetForText(renderer.root, 'YouTube').props.onLongPress();
    });

    expect(getTextNodes(renderer.root, 'Close').length).toBe(1);
    expect(getTextNodes(renderer.root, 'Rename').length).toBe(1);
    expect(getTextNodes(renderer.root, 'Hide').length).toBe(1);
    expect(getTextNodes(renderer.root, 'Info').length).toBe(1);
    expect(getTextNodes(renderer.root, 'Delete').length).toBe(1);

    await act(async () => {
      findTouchTargetForText(renderer.root, 'Rename').props.onPress();
    });

    const inputs = renderer.root.findAllByType(TextInput);
    const renameInput = inputs.find(i => i.props.placeholder === 'Enter new App name...')!;
    await act(async () => {
      renameInput.props.onChangeText('videos');
    });
    await act(async () => {
      findTouchTargetForText(renderer.root, 'Done').props.onPress();
    });

    expect(getTextNodes(renderer.root, 'Videos').length).toBe(1);
    expect(getTextNodes(renderer.root, 'YouTube').length).toBe(0);

    // Blank rename restores original label
    await act(async () => {
      findTouchTargetForText(renderer.root, 'Videos').props.onLongPress();
    });
    await act(async () => {
      findTouchTargetForText(renderer.root, 'Rename').props.onPress();
    });
    const renameInput2 = renderer.root
      .findAllByType(TextInput)
      .find(i => i.props.placeholder === 'Enter new App name...')!;
    await act(async () => {
      renameInput2.props.onChangeText('   ');
    });
    await act(async () => {
      findTouchTargetForText(renderer.root, 'Done').props.onPress();
    });

    expect(getTextNodes(renderer.root, 'YouTube').length).toBe(1);
    act(() => renderer.unmount());
  });

  it('calls openAppSettings on Info and uninstallApp on Delete', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal isModalVisible={true} onAppSelect={jest.fn()} closeModal={jest.fn()} />,
      );
      await Promise.resolve();
    });

    await act(async () => {
      findTouchTargetForText(renderer.root, 'YouTube').props.onLongPress();
    });
    await act(async () => {
      findTouchTargetForText(renderer.root, 'Info').props.onPress();
    });
    expect(NativeModules.AppList.openAppSettings).toHaveBeenCalledWith(
      'com.google.android.youtube',
    );

    await act(async () => {
      findTouchTargetForText(renderer.root, 'YouTube').props.onLongPress();
    });
    await act(async () => {
      await findTouchTargetForText(renderer.root, 'Delete').props.onPress();
    });
    expect(NativeModules.AppList.uninstallApp).toHaveBeenCalledWith(
      'com.google.android.youtube',
    );
    act(() => renderer.unmount());
  });

  it('renders DefaultActionsRow and RenameRow cleanly in isolation', () => {
    const item = mockApps[0];
    const onClose = jest.fn();
    let r1!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      r1 = ReactTestRenderer.create(
        <DefaultActionsRow
          item={item}
          handleRename={jest.fn()}
          handleInfo={jest.fn()}
          handleDelete={jest.fn()}
          handleToggleHide={jest.fn()}
          closeActions={onClose}
        />,
      );
    });
    const buttons = r1.root.findAllByType(TouchableOpacity);
    expect(buttons.length).toBe(5);
    act(() => buttons[0].props.onPress());
    expect(onClose).toHaveBeenCalled();
    act(() => r1.unmount());

    const onSave = jest.fn();
    let r2!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      r2 = ReactTestRenderer.create(
        <RenameRow
          item={item}
          rename="MyApp"
          setRename={jest.fn()}
          handleRename={onSave}
          closeActions={jest.fn()}
        />,
      );
    });
    act(() => r2.root.findByType(TextInput).props.onSubmitEditing());
    expect(onSave).toHaveBeenCalledWith(item);
    act(() => r2.unmount());
  });

  it('auto-launches single match only when fromSettingsModal is false', async () => {
    jest.useFakeTimers();
    useAppStore.setState({
      settingState: {
        ...initialState.settingState,
        autoShowKeyboard: false,
        autoLaunchSearch: true,
      },
    });

    const onAppSelect = jest.fn();
    const closeModal = jest.fn();

    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AppListModal
          isModalVisible={true}
          onAppSelect={onAppSelect}
          closeModal={closeModal}
          fromSettingsModal={true}
        />,
      );
      await Promise.resolve();
    });

    await act(async () => {
      renderer.root.findByType(TextInput).props.onChangeText('YouT');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onAppSelect).not.toHaveBeenCalled();

    await act(async () => {
      renderer.update(
        <AppListModal
          isModalVisible={true}
          onAppSelect={onAppSelect}
          closeModal={closeModal}
          fromSettingsModal={false}
        />,
      );
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onAppSelect).toHaveBeenCalledWith(
      expect.objectContaining({packageName: 'com.google.android.youtube'}),
    );
    expect(closeModal).toHaveBeenCalled();
    act(() => renderer.unmount());
    jest.useRealTimers();
  });
});
