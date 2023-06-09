import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { connectStorageEmulator } from "firebase/storage";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "react-native-elements";
import { Appbar, IconButton } from "react-native-paper";
import Group from "../screens/Group";
import GroupCalendar from "../screens/GroupCalendar";
import GroupMember from "../screens/GroupMember";
import EventPage from "../screens/EventPage";

import { getAuth } from "firebase/auth";
import { MyContext } from "../constants/context";
import { View, Image, Text } from "react-native";
import { ActivityIndicator, } from "react-native-paper";
import EventDashboard from "./EventDashboard";

const Stack = createNativeStackNavigator()
function GroupDashboard(props: any) {
    const auth = getAuth();
    const user = auth.currentUser;
    const { groups, events } = useContext(MyContext);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [admin, setAdmin] = useState(false);

    const group = groups.find((group: any) => group.id === props.route.params.gid);
    const groupEvents = events.filter( (event: any) => event.data.gid === group.id);

    const navBack = () => {
        props.navigation.navigate('Group');
    }
    useEffect(() => {
        if (group !== undefined) {
            setLoading(false);
            setAdmin(group.data.admin.includes(user?.email) as boolean)
        } else {
            setLoading(false);
            setRedirect(true);
        }
    }, [groups]);


    // const stackNavigator = props.navigation.getParent(); // this is what you need
    // if (stackNavigator) {
    //   stackNavigator.setOptions({
    //     title: props.route.params.name
    //   });
    // }



    if (loading) {
        return (<View style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator color={"#2044E0"} size="large" />
        </View>)
    } else if (redirect || group === undefined) {
        props.navigation.navigate('HomeTab');

    }
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Group" children={() => <Group {...props} group={group} admin={admin} />} />
            <Stack.Screen name="GroupMembers" children={() => <GroupMember  {...props} admin={admin} group={group} navBack={navBack} />} />
            <Stack.Screen name="GroupCalendar" children={() => <GroupCalendar  {...props} admin={admin} group={group} events={groupEvents} navBack={navBack}/>} />
            <Stack.Screen name="EventDashboard" component={EventDashboard}  />
        </Stack.Navigator>
    )
}
export default GroupDashboard;
