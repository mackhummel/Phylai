import { collectionGroup, DocumentData, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View , Text, ScrollView, Platform} from "react-native";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";
import { MyContext } from "../constants/context";


const PersonalCalendar = (props:any) => {
    const [events, setEvents] = useState<any>([]);

    const { groups, uid } = useContext(MyContext);
    


    useEffect(() => {
        groups.forEach(async (group: any) => {
            const q = query(collectionGroup(db, 'events'), where("gid", "==", group.id), orderBy('timestamp', 'desc'));
            let promise = await getDocs(q).then( (res) => {
                res.forEach( (doc) => {
                    setEvents((prevEvents: any) => ([...prevEvents, doc.data()]))
                });
            });
        });

    const q2 = query(collectionGroup(db, "events"), where("uid", "==", uid));
    const unsubscribeEvents = onSnapshot(q2, (snapshot) => {
            snapshot.docs.map( (doc) => {
            setEvents((prevEvents: any) => ([ ...prevEvents, doc.data()]));
        });
    });
        
    return () => {
        unsubscribeEvents();
    }
    }, []);

   
    return (
        <ScrollView contentContainerStyle={{alignItems:'center', justifyContent: 'center'}}>
            <View style={{width: Platform.OS === 'web' ? '50%': '100%', flex:1,}}>
                <CalendarComponent personal={true} events={events} uid={uid}/>
            </View>
        </ScrollView>
    );
  }
  
  
  export default PersonalCalendar;