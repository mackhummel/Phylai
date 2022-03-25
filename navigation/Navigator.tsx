import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeNavigator from "./HomeNavigator";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";

import { auth } from "../config/firebase";
import LinkingConfiguration from './LinkingConfiguration';



export default function Navigator() {
    return (
        <NavigationContainer
         linking={LinkingConfiguration}
        >
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator()

function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Dashboard" component={HomeNavigator} />
        </Stack.Navigator>
    )
}