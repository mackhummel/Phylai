import { collectionGroup, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View , Text, ScrollView, Platform} from "react-native";
import { Appbar } from "react-native-paper";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";

const GroupCalendar = (props:any) => {
  //const { gid, name, admin } = props.route.params;
  const [events, setEvents] = useState<any>([]);
  const admin = props.admin;
  const group = props.group;

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
          <Appbar.Header>
              <Appbar.BackAction onPress={() => props.navBack()} />
              <Appbar.Content title={group.data.name + ' Calendar'}/>
          </Appbar.Header>
      )
   });
    //poll changes in events
    const q2 = query(collectionGroup(db, 'events'), where("gid", "==", group.id), orderBy('timestamp', 'desc'));
    const unsubscribeEvents = onSnapshot(q2, (snapshot) => setEvents(
      snapshot.docs.map((doc) => ({ ...doc.data() }))));

  
    return () => {
        unsubscribeEvents();
     }
}, []);



    return (
        <ScrollView contentContainerStyle={{alignItems:'center', justifyContent: 'center'}} >
           <View style={{width: Platform.OS === 'web' ? '50%': '100%', flex:1,}}>
              <CalendarComponent gid={group.id} admin={admin} events={events}/>
              </View>
        </ScrollView>
    );
  }
  
  
  export default GroupCalendar;

function setEvents(arg0: { [x: string]: any; }[]): void {
  throw new Error("Function not implemented.");
}
