import { collectionGroup, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View , Text} from "react-native";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";

const GroupCalendar = (props:any) => {
  const { gid, name, admin } = props.route.params;
  const [events, setEvents] = useState<any>([]);


  useEffect(() => {
        
    //poll changes in events
    const q2 = query(collectionGroup(db, 'events'), where("gid", "==", gid), orderBy('timestamp', 'desc'));
    const unsubscribeEvents = onSnapshot(q2, (snapshot) => setEvents(
      snapshot.docs.map((doc) => ({ ...doc.data() }))));

  
    return () => {
        unsubscribeEvents();
     }
}, []);



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CalendarComponent gid={gid} admin={admin} events={events}/>
        </View>
    );
  }
  
  
  export default GroupCalendar;

function setEvents(arg0: { [x: string]: any; }[]): void {
  throw new Error("Function not implemented.");
}
