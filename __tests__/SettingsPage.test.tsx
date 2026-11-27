import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Text, TouchableOpacity} from 'react-native';
import useAppStore from '../src/Store/AppStore';
import {DEFAULT_SETTINGS, SettingKey} from '../src/Constants/ConstantVar';
import SettingsPage from '../src/Components/organisms/SettingsPage/SettingsPage';

describe('SettingsPage - Gesture Reset & Labels', () => {
  beforeEach(() => {
    useAppStore.setState({
      apps: [
        {label: 'YouTube', packageName: 'com.google.android.youtube', index: 0},
      ],
      settingState: {
        ...DEFAULT_SETTINGS,
        [SettingKey.SWIPE_UP]: 'com.google.android.youtube',
      },
    });
  });

  it('displays app label and allows per-row reset back to default gesture', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <SettingsPage
          visible={true}
          closeSettingsModal={jest.fn()}
          onPickGestureApp={jest.fn()}
        />,
      );
      await Promise.resolve();
    });

    const texts = renderer.root.findAllByType(Text).map(t => t.props.children);
    expect(texts).toContain('YouTube');

    const resetBtn = renderer.root.findAllByType(TouchableOpacity).find(
      b => b.props.accessibilityLabel === 'Reset Swipe up',
    );
    expect(resetBtn).toBeTruthy();

    await act(async () => {
      resetBtn!.props.onPress();
    });

    expect(useAppStore.getState().settingState[SettingKey.SWIPE_UP]).toBe(
      'AppDrawer',
    );
    act(() => renderer.unmount());
  });
});

