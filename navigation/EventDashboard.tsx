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

const Stack = createNativeStackNavigator()
function EventDashboard(props: any) {
    const auth = getAuth();
    const user = auth.currentUser;
    const { groups } = useContext(MyContext);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const {admin, group, eid} = props;
    
    // const group = groups.find((group: any) => group.id === props.route.params.gid);
    // const admin = group.data.admin.includes(user?.email) as boolean
    const navBack = () => {
        if(group !== undefined){
            props.navigation.goBack();

        }else{
            props.navigation.goBack();
        }
    }
    useEffect(() => {
        if (group !== undefined) {
            setLoading(false);
        } else {
            setLoading(false);
            setRedirect(true);

        }
    }, []);


    if (loading) {
        return (<View style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator color={"#2044E0"} size="large" />
        </View>)
    }

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Event" children={() => <EventPage  {...props} event={props.route.params.event} eid={props.route.params.eid} navBack={navBack} />}/>
        </Stack.Navigator>
    )
}
export default EventDashboard;
