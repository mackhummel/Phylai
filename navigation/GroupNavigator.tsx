import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { connectStorageEmulator } from "firebase/storage";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "react-native-elements";
import Group from "../screens/Group";
import GroupCalendar from "../screens/GroupCalendar";
import GroupMember from "../screens/GroupMember";
import { getAuth } from "firebase/auth";
import { MyContext } from "../constants/context";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";


const Tab = createBottomTabNavigator();
function GroupDashboard(props: any) {

    const { groups } = useContext(MyContext);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);


    
    useLayoutEffect(() => {
        props.navigation.setOptions({ headerTitle: props.route.params.name , headerRight:null});
      }, [props.navigation, props.route]);
        // const stackNavigator = props.navigation.getParent(); // this is what you need
        // if (stackNavigator) {
        //   stackNavigator.setOptions({
        //     title: props.route.params.name
        //   });
        // }
        console.log(props.route.params.gid);

        useEffect(() => {
            if(groups.find((group: any) => group.id === props.route.params.gid) !== undefined){
                setLoading(false);
            }else{
                setLoading(false);
                setRedirect(true);
                
            }
        }, []);

        if (loading) {
            return (<View style={{flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center'}}>
              <ActivityIndicator color={"#2044E0"} size="large" />
            </View>)
        }else if(redirect){
            props.navigation.replace('HomeTab');
        }
      

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
