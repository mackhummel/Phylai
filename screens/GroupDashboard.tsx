import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Icon } from "react-native-elements";
import Group from "./Group";
import GroupCalendar from "./GroupCalendar";

const Tab = createBottomTabNavigator();
function GroupDashboard(){
    
    return(
        <Tab.Navigator screenOptions={{
            headerShown: false
          }}>  
            <Tab.Screen name="Group" component={Group} options={{ tabBarIcon:()=>{return(<Icon name="group" type="font-awesome"/>)}}}/>
            <Tab.Screen name="GroupCalendar" component={GroupCalendar} options={{title:'Calendar',tabBarIcon:()=>{return(<Icon name="calendar" type="font-awesome"/>)}}}/>
        </Tab.Navigator>
    )
}
export default GroupDashboard;
