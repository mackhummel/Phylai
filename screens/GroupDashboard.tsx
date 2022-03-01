import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useLayoutEffect } from "react";
import { Icon } from "react-native-elements";
import Group from "./Group";
import GroupCalendar from "./GroupCalendar";

const Tab = createBottomTabNavigator();
function GroupDashboard(props: any) {
    useLayoutEffect(() => {
        props.navigation.setOptions({ headerTitle: props.route.params.name });
      }, [props.navigation, props.route]);
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

            <Tab.Screen name="Group" children={() => <Group {...props} />} options={{ title: "Messaging",tabBarIcon: () => { return (<Icon name="group" type="font-awesome" />) } }} />
            <Tab.Screen name="GroupCalendar" children={() => <GroupCalendar  {...props} />} options={{ title: 'Calendar', tabBarIcon: () => { return (<Icon name="calendar" type="font-awesome" />) } }} />
        </Tab.Navigator>
    )
}
export default GroupDashboard;
