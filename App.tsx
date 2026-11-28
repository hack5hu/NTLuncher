import React, {useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LauncherScreen from './src/Launcher/Launcher';
import 'react-native-reanimated';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: 'transparent',
    flex: 1,
  };

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={backgroundStyle}>
        <LauncherScreen />
      </View>
    </SafeAreaProvider>
  );
}

export default App;

