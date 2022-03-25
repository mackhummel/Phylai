import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import GroupDashboard from "./GroupNavigator";
import PersonalCalendar from "../screens/PersonalCalendar";
import Home from "../screens/Home";
import React from "react";
import { Button, View, Image } from "react-native";
import AddGroup from "../components/AddGroup";
import { Appbar, IconButton } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../config/firebase";


const Dashboard = createNativeStackNavigator();
const anon = require('../assets/anon.png');

function DashboardStack(props: any) {
  const auth = getAuth();
  const user = auth.currentUser;

  const signOutUser = () => {
    signOut(auth).then(() => {
      props.navigation.replace("Login")
      console.log("Logout Successful")
    }).catch((error) => {
      console.log("Logout error: ", error.message);
    })
  }
  return (
    <Dashboard.Navigator screenOptions={{
      header:()=>(
          <Appbar.Header>
            <Image source={{ uri: user?.photoURL ? user.photoURL : anon }} style={{ width: 48, height: 48, borderRadius: 48 / 2 }} />
            <Appbar.Content title={user?.displayName}/>
            <Appbar.Action icon='calendar'/>
            <Appbar.Action icon='account-settings'/>
            <Appbar.Action icon='logout' onPress={signOutUser}/>
          </Appbar.Header>
      )
     
    }}>
      <Dashboard.Screen name="Home" component={Home} />
      <Dashboard.Screen name="GroupDashboard" component={GroupDashboard} options={() => ({
        headerTitle: ''
      })} />
      <Dashboard.Screen name="PersonalCalendar" component={PersonalCalendar} />
    </Dashboard.Navigator>
  )
}
export default DashboardStack;
