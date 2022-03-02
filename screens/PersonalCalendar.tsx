import { collectionGroup, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View , Text} from "react-native";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";

const PersonalCalendar = (props:any) => {
    const [events, setEvents] = useState<any>([]);

    const {groups} = props.route.params;

    useEffect(() => {
        groups.forEach(async (group: any) => {
            const q = query(collectionGroup(db, 'events'), where("gid", "==", group.id), orderBy('timestamp', 'desc'));
            let promise = await getDocs(q).then( (res) => {
                res.forEach( (doc) => {
                    setEvents((prevEvents: any) => ([...prevEvents, doc.data()]))
                });
            });
        });
    }, []);

   
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CalendarComponent personal={true} events={events}/>
        </View>
    );
  }
  
  
  export default PersonalCalendar;