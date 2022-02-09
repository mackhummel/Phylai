import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import { ThemeProvider } from 'react-native-elements';
import { getAuth } from 'firebase/auth';

const Stack = createNativeStackNavigator()

const theme = {
  Button: {
    buttonStyle: {
      width: "100%",
      borderRadius: 10,
      backgroundColor: "#2044E0",
    },
  },
  
  
};
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        {/* <Navigation colorScheme={colorScheme} />
        <StatusBar /> */}
        <ThemeProvider theme={theme}>
          <NavigationContainer >
            <Stack.Navigator screenOptions={{
              headerShown: false
            }}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={SignUp} />
              <Stack.Screen name="Home" component={Home}/>
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}
