import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

import GroupDashboard from "./GroupNavigator";
import PersonalCalendar from "../screens/PersonalCalendar";
import Home from "../screens/Home";
import React from "react";
import { Button, View } from "react-native";
import AddGroup from "../components/AddGroup";
import { IconButton } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const Dashboard = createNativeStackNavigator();
function DashboardStack(props:any){
    const auth = getAuth();
    const signOutUser = () => {
        signOut(auth).then(() => {
          props.navigation.replace("Login")
          console.log("Logout Successful")
        }).catch((error) => {
          console.log("Logout error: ", error.message);
        })
      }
    return(
        <Dashboard.Navigator screenOptions={{
            headerBackTitleVisible:true,
                headerRight: () => (
                  <>
                    <AddGroup />
                    <IconButton icon='logout' onPress={signOutUser} />
                    </>
                ),
          }}>
            <Dashboard.Screen name="Home" component={Home}/>
            <Dashboard.Screen name="GroupDashboard" component={GroupDashboard}  options={()=>({
                headerTitle:''
            })}/>
            <Dashboard.Screen name="PersonalCalendar" component={PersonalCalendar}/>
        </Dashboard.Navigator>
    )
}
export default DashboardStack;
