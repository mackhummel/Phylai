/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View , Text} from 'react-native';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import SignUp from '../screens/SignUp';
import TabOneScreen from '../screens/TabOneScreen';
import SignIn from '../screens/SignIn';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { auth } from '../config/firebase';

const Stack = createNativeStackNavigator();
// class Navigation extends React.Component<any, any>{
//   auth = getAuth();
//   user = auth.currentUser;
//   constructor(props: any){
//       super(props);
//       this.state = {
//          loading: true
//       }
//   }
  
//   render(){
//       return (
//           this.user ? (<Stack.Screen name="Home" component={TabOneScreen} options={{ headerShown: false }}/>):(<Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/> )
//         );
//   }
// }

// export default SignUp;

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [loading, setLoadingChange] = React.useState(true);
  const [user, setUser] = React.useState();
  onAuthStateChanged(auth, (user:any) => {
    setUser(user);
    if(loading) setLoadingChange(false);
  });
  if(loading){
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        {
          user ? (<Stack.Screen name="Home" component={TabOneScreen} options={{ headerShown: false }}/>):(<><Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/><Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/></> )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

// function RootNavigator() {
  
//   return (
//       <Stack.Navigator>
         
//       </Stack.Navigator>
//   );

  
// }

// /**
//  * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
//  * https://reactnavigation.org/docs/bottom-tab-navigator
//  */
// const BottomTab = createBottomTabNavigator<RootTabParamList>();

// function BottomTabNavigator() {
//   const colorScheme = useColorScheme();

//   return (
//     <BottomTab.Navigator
//       initialRouteName="TabOne"
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme].tint,
//       }}>
//       <BottomTab.Screen
//         name="TabOne"
//         component={TabOneScreen}
//         options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
//           title: 'Tab One',
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//           headerRight: () => (
//             <Pressable
//               onPress={() => navigation.navigate('Modal')}
//               style={({ pressed }) => ({
//                 opacity: pressed ? 0.5 : 1,
//               })}>
//               <FontAwesome
//                 name="info-circle"
//                 size={25}
//                 color={Colors[colorScheme].text}
//                 style={{ marginRight: 15 }}
//               />
//             </Pressable>
//           ),
//         })}
//       />
//       <BottomTab.Screen
//         name="TabTwo"
//         component={TabTwoScreen}
//         options={{
//           title: 'Tab Two',
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       />
//     </BottomTab.Navigator>
//   );
// }

// /**
//  * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
//  */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
// }
