import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import { LogBox } from 'react-native';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigator from './navigation/Navigator';

LogBox.ignoreLogs(['Warning: ...']);
// const theme = {
//   ...DarkTheme,
//   dark:true,
//   colors: {
//     ...DarkTheme.colors,
//     primary: '#2044E0',
//     accent: 'white',
//     text:'white',
//     surface:'black'
//   },
// };
const theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2044E0',
    accent: 'white',
    text: 'black',

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
        </SafeAreaProvider >
      </PaperProvider>
    );
  }
}
