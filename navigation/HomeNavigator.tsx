import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import PersonalCalendar from "../screens/PersonalCalendar";
import { colors } from "react-native-elements";
import Home from "../screens/Home";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Image } from "react-native";
import AddGroup from "../components/AddGroup";
import { IconButton, Appbar, Button, BottomNavigation, useTheme, Avatar } from "react-native-paper";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from '../config/firebase';
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { MyContext } from "../constants/context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import GroupDashboard from "./GroupNavigator";
import Friends from "../screens/Friends";
import Icon from 'react-native-vector-icons/MaterialIcons';


const Dashboard = createNativeStackNavigator();
const anon = require('../assets/anon.png');

function HomeTab(props: any) {
  const theme = useTheme();
  const user = auth.currentUser;
  const HomeTab = createBottomTabNavigator();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Groups', icon: 'account-group' },
    { key: 'calendar', title: 'Calendar', icon: 'calendar-month' },
    { key: 'friends', title: 'Friends', icon: 'account-search-outline' }
  ])
  const renderScene = BottomNavigation.SceneMap({
    home: () => <Home {...props} />,
    calendar: PersonalCalendar,
    friends: Friends
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
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
      theme={theme}
    />
  );
}

function DashboardStack(props: any) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [groups, setGroups] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any>();
  const [friendRequests, setFriendRequests] = useState<any>();

  const getProfile = async (email: string) => {
    const friendDocRef = doc(db, 'user', email);
    const profData = (await getDoc(friendDocRef)).data();
    return profData;
  }

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          //Group Snapshot
          const queryMembers = query(collection(db, "group"), where('member', 'array-contains', user?.email));
          const unsubscribeGroup = await onSnapshot(queryMembers, (snapshot) => setGroups(snapshot.docs.map((doc) => ({
            ...({
              data: doc.data(),
              id: doc.id
            })
          }))));
          //Friend Snapshot
          const userDocRef = doc(db, "user", user.email as string);
          const unsubscribeFriends = onSnapshot(userDocRef, (snapshot) => setFriends(snapshot.data()?.friends.map((doc: any) => doc)));
          const unsubscribeRequests = onSnapshot(userDocRef, (snapshot) => setFriendRequests(snapshot.data()?.requests.map((doc: any) => doc)));
          setLoading(false);
          return () => {
            unsubscribeGroup();
            unsubscribeFriends();
            unsubscribeRequests();
          }
        } else {
          props.navigation.replace('Login');
        }
      })

    ,
    [])

  if (loading || (groups === undefined)) {
    return (<View style={{
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ActivityIndicator color={colors.primary} size="large" />
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
    uid: user?.uid,
    friends: friends,
    requests: friendRequests
  }
  return (
    <MyContext.Provider value={data}>
      <Dashboard.Navigator screenOptions={{
        header: () => (
          <Appbar.Header >
            <Avatar.Image size={40} source={{uri: user?.photoURL ? user.photoURL : anon}}/>
            {/* <Image source={{ uri: user?.photoURL ? user.photoURL : anon }} style={{ width: 48, height: 48, borderRadius: 48 / 2 }} /> */}
            <Appbar.Content title={user?.displayName} />
            <Appbar.Action icon='logout' onPress={signOutUser} /> 
            <Appbar.Action icon={()=><Icon name='settings' size={25}/>} />
            
          </Appbar.Header>
        )

      }}>
        <Dashboard.Screen name="HomeTab" component={HomeTab} />
        <Dashboard.Screen name="GroupDashboard" component={GroupDashboard} />
      </Dashboard.Navigator>
    </MyContext.Provider>
  )
}
export default DashboardStack;
