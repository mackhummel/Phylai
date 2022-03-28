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
import { getAuth } from "firebase/auth";
import { MyContext } from "../constants/context";
import { View, Image, Text } from "react-native";
import { ActivityIndicator, } from "react-native-paper";

const Stack = createNativeStackNavigator()
function GroupDashboard(props: any) {
    const auth = getAuth();
    const user = auth.currentUser;
    const { groups } = useContext(MyContext);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const group = groups.find((group: any) => group.id === props.route.params.gid);
    const admin = group.data.admin.includes(user?.uid) as boolean
    const navBack = () => {
        props.navigation.navigate('Group');
    }
    useEffect(() => {
        if (group !== undefined) {
            setLoading(false);
        } else {
            setLoading(false);
            setRedirect(true);

        }
    }, []);


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
    } else if (redirect) {
        props.navigation.replace('HomeTab');
    }


    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Group" children={() => <Group {...props} group={group} admin={admin} />} />
            <Stack.Screen name="GroupCalendar" children={() => <GroupCalendar  {...props} admin={admin} group={group} navBack={navBack}/>} />
            <Stack.Screen name="GroupMember" children={() => <GroupMember  {...props} admin={admin} group={group} navBack={navBack} />} />
        </Stack.Navigator>
    )
}
export default GroupDashboard;
