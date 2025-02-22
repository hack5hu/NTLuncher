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
  const isDarkMode = useColorScheme() === 'dark';

  // 🔹 Make the background fully transparent
  const backgroundStyle = {
    backgroundColor: 'transparent', // ✅ Set transparent
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
      {/* 🔹 Ensures the launcher fully overlays the wallpaper */}
      <DateAndTime />
      <LauncherScreen />
    </View>
  );
}

export default App;
