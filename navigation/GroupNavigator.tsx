import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useLayoutEffect } from "react";
import { Icon } from "react-native-elements";
import { Appbar, IconButton } from "react-native-paper";
import Group from "../screens/Group";
import GroupCalendar from "../screens/GroupCalendar";
import GroupMember from "../screens/GroupMember";
import {Image } from "react-native";

const Tab = createBottomTabNavigator();
function GroupDashboard(props: any) {
    useLayoutEffect(() => {
        console.log(props.navigation.getParent())
        props.navigation.setOptions({header:()=>(
            <Appbar.Header>
                <Appbar.BackAction onPress={()=>props.navigation.goBack()}/>
                <Image source={{ uri: props.route.params.photoURL? props.route.params.photoURL : null }} style={{ width: 48, height: 48, borderRadius: 48 / 4 }} />
                <Appbar.Content title={props.route.params.name}/>
                <Appbar.Action icon='account-group'/>
                <Appbar.Action icon='calendar'/>
            </Appbar.Header>
        )});
      }, []);
        // const stackNavigator = props.navigation.getParent(); // this is what you need
        // if (stackNavigator) {
        //   stackNavigator.setOptions({
        //     title: props.route.params.name
        //   });
        // }
      

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Tab.Screen name="Group" children={() => <Group {...props} />} options={{ title: "Messaging",tabBarIcon: () => { return (<Icon name="chat" type="entypo" />) } }} />
            <Tab.Screen name="GroupCalendar" children={() => <GroupCalendar  {...props} />} options={{ title: 'Calendar', tabBarIcon: () => { return (<Icon name="calendar" type="font-awesome" />) } }} />
            <Tab.Screen name="GroupMember" children={() => <GroupMember  {...props} />} options={{ title: 'Members', tabBarIcon: () => { return (<Icon name="group" type="font-awesome" />) } }} />
        </Tab.Navigator>
    )
}
export default GroupDashboard;
