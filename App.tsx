import React, {useEffect} from 'react';
import {
  useColorScheme,
  View,
  BackHandler,
} from 'react-native';
import LauncherScreen from './src/Luncher/Luncher';
import 'react-native-reanimated';
import DateAndTime from './src/Components/DateAndTime/DateAndTime';

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
    <View style={backgroundStyle}>
      <DateAndTime />
      <LauncherScreen />
    </View>
  );
}

export default App;
