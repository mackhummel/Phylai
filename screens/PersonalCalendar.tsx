import { collectionGroup, DocumentData, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View , Text} from "react-native";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";

const PersonalCalendar = (props:any) => {
    const [events, setEvents] = useState<any>([]);

    const {groups, uid} = props.route.params;

    useEffect(() => {
        groups.forEach(async (group: any) => {
            const q = query(collectionGroup(db, 'events'), where("gid", "==", group.id), orderBy('timestamp', 'desc'));
            let promise = await getDocs(q).then( (res) => {
                res.forEach( (doc) => {
                    setEvents((prevEvents: any) => ([...prevEvents, doc.data()]))
                });
            });
        });

        const q2 = query(collectionGroup(db, "user"), where("uid", "==", uid));
        const unsubscribeEvents = onSnapshot(q2, (snapshot) => setEvents(
        snapshot.docs.map((doc) => ({ ...doc.data() }))));

  
    return () => {
        unsubscribeEvents();
     }
    }, []);

   
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CalendarComponent personal={true} events={events} uid={uid}/>
        </View>
    );
  }
  
  
  export default PersonalCalendar;