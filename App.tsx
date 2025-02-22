import React, {useEffect} from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Linking,
  BackHandler,
} from 'react-native';
import LauncherScreen from './src/Luncher/Luncher';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import DateAndTime from './src/Components/DateAndTime/DateAndTime';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'grey',
    flex: 1,
  };
  const setAsDefaultLauncher = () => {
    Linking.openSettings();
  };
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup
  }, []);

  return (
    <View style={backgroundStyle}>
      <DateAndTime />
      <LauncherScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
