import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import { LogBox } from 'react-native';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigator from './navigation/Navigator';
import { StatusBar } from 'expo-status-bar';

LogBox.ignoreLogs(['Warning: ...']);
// const theme = {
//   ...DarkTheme,
//   dark:true,
//   colors: {
//     ...DarkTheme.colors,
//     primary: '#4B9CD3',
//     accent: 'blue',
//     surface:'#4B9CD3',
//     background:'black',
//     text: 'white'
//   },
// };
const theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4B9CD3',
    accent: 'white',
    text: 'white',
    surface:'#13294B',
    background:'#13294B',
  },
};
export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={theme} >
        <SafeAreaProvider>
          <Navigator />
          <StatusBar style={'light'} />
        </SafeAreaProvider >
      </PaperProvider>
    );
  }
}
