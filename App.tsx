import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import { ThemeProvider } from 'react-native-elements';
import useCachedResources from './hooks/useCachedResources';
import { LogBox, ScrollView } from 'react-native';
import Group from './screens/Group';
import Dashboard from './screens/Dashboard';

const Stack = createNativeStackNavigator()
LogBox.ignoreLogs(['Warning: ...']);
const theme = {
  Button: {
    buttonStyle: {
      width: "100%",
      borderRadius: 10,
      backgroundColor: "#2044E0",
    },
    containerStyle:{
      margin:5,
    }
  },
  ScrollView: {
    contentContainerStyle:{
      paddingVertical:20,
    }
  }


};
export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
            <NavigationContainer >
              <Stack.Navigator screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
               
              </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>

      </SafeAreaProvider>
    );
  }
}
