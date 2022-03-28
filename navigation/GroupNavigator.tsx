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
    
    useEffect(() => {
        if(group !== undefined){
            
            props.navigation.setOptions({header:()=>(
                <Appbar.Header>
                    <Appbar.BackAction onPress={()=>props.navigation.goBack()}/>
                    <Image source={{ uri: group.data.photoURL? group.data.photoURL : null }} style={{ width: 48, height: 48, borderRadius: 48 / 4 }} />
                    <Appbar.Content title={group.data.name}/>
                    
                    <Appbar.Action  icon='message' onPress={()=>props.navigation.replace('Group')}/>
                    <Appbar.Action icon='account-group' onPress={()=>props.navigation.replace('GroupMember')}/>
                    <Appbar.Action icon='calendar' onPress={()=> props.navigation.replace('GroupCalendar')}/>
                </Appbar.Header>
            )});
            setLoading(false);
        }else{
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
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Group" children={() => <Group {...props} group={group} admin={admin}/>}  />
            <Stack.Screen name="GroupCalendar" children={() => <GroupCalendar  {...props} admin={admin} group={group}/>} />
            <Stack.Screen name="GroupMember" children={() => <GroupMember  {...props} admin={admin} group={group}/>}/>
        </Stack.Navigator>
    )
}
export default GroupDashboard;
