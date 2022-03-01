import React, {useState, useContext, useEffect, Component, Fragment} from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Calendar, Agenda, CalendarProps } from "react-native-calendars";
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import moment from 'moment';
import { addDoc, collection, collectionGroup, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';

interface props {
    gid: string;
    admin: boolean;
}

const GroupCalendarComponent = (props: props) => {
    const [events, setEvents] = useState<any>([]);
    const gid = props.gid;
    const admin = props.admin;



    const [eventName, setEventName] = useState('');
    const [newDate, setNewDate] = useState('');
    const [eventInfo, setEventInfo] = useState('');
    const [eventLocation, setEventLocation] = useState('');

    const [finalDates, setFinalDates] = useState({});
    const[markedObjects, setMarkedObjects] = useState<any>({});

    //to be updated to current date
    const [selected, setSelected] = useState('2022-02-27');

    interface markedObj {
        [key: string]: {};
      }
    const markedDates : markedObj = {};
    

    useEffect(() => {
        
        //poll changes in events
        const q2 = query(collectionGroup(db, 'events'), where("gid", "==", props.gid), orderBy('timestamp', 'desc'));
        const unsubscribeEvents = onSnapshot(q2, (snapshot) => setEvents(snapshot.docs.map((doc) => ({ ...doc.data() }))));

        return () => {
            unsubscribeEvents();
         }

    }, []);

    useEffect(() => {

        // markedDates[selected] = {
        //     selected: true,
        //     disableTouchEvent: true,
        //     selectedColor: 'blue',
        //     selectedTextColor: 'white'
        // };
        events.forEach((event: { timestamp: any; }) => {
            markedDates[event.timestamp] = {marked: true, dotColor: 'blue'};
        });
        setMarkedObjects(markedDates);
        
    }, [events]);



    const addEvent = async () => {
        if((eventName === "") || (newDate === "")){
            return;
        }
        await addDoc(collection(db, "group", gid, "events"), {
            gid: gid,
            timestamp: newDate,
            name: eventName,
            information: eventInfo ? eventInfo : null,
            location: eventLocation ? eventLocation : null
        }).then(() => {
            console.log("Event Added Sucessfully")
            setEventName("");
            setNewDate("");
            setEventInfo("");
            setEventLocation("");
        }).catch((error) => console.log("Add Event failed: " + error.message));
    }

    const onDayPress: CalendarProps['onDayPress'] = day => {
        setSelected(day.dateString);
      };

    return (
        <View style={styles.list}>
            <Input
                placeholder='Event Name'
                value={eventName}
                onChangeText={(text) => setEventName(text)}
            />
             <Input
                placeholder='Event Date (Datestring format)'
                value={newDate}
                onChangeText={(text) => setNewDate(text)}
            />
             <Input
                placeholder='Event Location'
                value={eventLocation}
                onChangeText={(text) => setEventLocation(text)}
            />
             <Input
                placeholder='Event Information'
                value={eventInfo}
                onChangeText={(text) => setEventInfo(text)}
            />
            <Button
            onPress={() => addEvent()}
            title="Add Event"
            buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
            />
            <Fragment>
                <Calendar
                enableSwipeMonths
                current={'2022-02-18'}
                style={styles.calendar}
                onDayPress={onDayPress}
                markedDates={{...markedObjects, [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: 'blue',
                    selectedTextColor: 'white'
                  } }}
                />
            </Fragment>
        </View>
            


        

    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        borderColor: "black",
        borderWidth: 2,
        width: Platform.OS === 'ios' ? "80%" : "20%",
        margin: 10,
        padding: 5
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        paddingBottom: 60
    },
    inputContainer: {
        marginTop: 10,
        width: Platform.OS === 'ios' ? "80%" : "40%",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    calendar: {
        marginBottom: 10
      }
});
export default GroupCalendarComponent;

function useStateCallback<T>(arg0: never[]): [any, any] {
    throw new Error('Function not implemented.');
}