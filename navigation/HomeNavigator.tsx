import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import PersonalCalendar from "../screens/PersonalCalendar";
import { Icon } from "react-native-elements";
import Home from "../screens/Home";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Image } from "react-native";
import AddGroup from "../components/AddGroup";
import { IconButton, Appbar, Button, BottomNavigation, useTheme } from "react-native-paper";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from '../config/firebase';
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { MyContext } from "../constants/context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import GroupDashboard from "./GroupNavigator";



const Dashboard = createNativeStackNavigator();
const anon = require('../assets/anon.png');

function HomeTab(props:any){
  const { colors } = useTheme();
  const user = auth.currentUser;
  const HomeTab = createBottomTabNavigator();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key:'home', title:'Groups', icon:'account-group', color:colors.primary },
    {key:'calendar', title:'Calendar', icon:'calendar-month',  color: colors.text}
  ])
  const renderScene = BottomNavigation.SceneMap({
    home: ()=><Home {...props}/>,
    calendar: PersonalCalendar
  })
  // const signOutUser = () => {
  //   signOut(auth).then(() => {
  //     props.navigation.replace("Login")
  //     console.log("Logout Successful")
  //   }).catch((error) => {
  //     console.log("Logout error: ", error.message);
  //   })
  // }


  return (
    // <HomeTab.Navigator screenOptions={{
    //   header:()=>(
    //       <Appbar.Header>
    //         <Image source={{ uri: user?.photoURL ? user.photoURL : anon }} style={{ width: 48, height: 48, borderRadius: 48 / 2 }} />
    //         <Appbar.Content title={user?.displayName}/>
    //         <Appbar.Action icon='account-settings'/>
    //         <Appbar.Action icon='logout' onPress={signOutUser}/>
    //       </Appbar.Header>
    //   )
    // }}>
    <BottomNavigation 
      navigationState={{index,routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{height:70}}
      shifting={true}
    />
    );
}

function DashboardStack(props:any){
  const auth = getAuth();
    const user = auth.currentUser;
    const [groups, setGroups] = useState<any>();
    const [loading, setLoading] = useState(true);


    useEffect(
      () =>
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const q = query(collection(db, "group"), where('member', 'array-contains', user?.uid));
            const unsubscribe = await onSnapshot(q, (snapshot) => setGroups(snapshot.docs.map((doc) => ({
              ...({
                data: doc.data(),
                id: doc.id
              })
            }))));
            setLoading(false);
            return unsubscribe;
          }else{
            props.navigation.replace('Login');
          }
        })
        
        ,
      [])

      if (loading || (groups === undefined)) {
        return (<View style={{flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'}}>
          <ActivityIndicator color={"#2044E0"} size="large" />
        </View>)
      }

      const signOutUser = () => {
        signOut(auth).then(() => {
          props.navigation.replace("Login")
          console.log("Logout Successful")
        }).catch((error) => {
          console.log("Logout error: ", error.message);
        })
      }

      const data = {
        groups: groups,
        uid: user?.uid
      }

    return(
        <MyContext.Provider value={data}>
          <Dashboard.Navigator screenOptions={{
            header:()=>(
          <Appbar.Header>
            <Image source={{ uri: user?.photoURL ? user.photoURL : anon }} style={{ width: 48, height: 48, borderRadius: 48 / 2 }} />
            <Appbar.Content title={user?.displayName}/>
            <Appbar.Action icon='account-circle'/>
            <Appbar.Action icon='logout' onPress={signOutUser}/>
          </Appbar.Header>
      )
              
          }}>
                <Dashboard.Screen name="HomeTab" component={HomeTab}/>
                <Dashboard.Screen name="GroupDashboard" component={GroupDashboard}/>
            </Dashboard.Navigator>
        </MyContext.Provider>
    )
}
export default DashboardStack;
