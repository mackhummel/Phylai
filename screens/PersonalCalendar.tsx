import { getAuth } from "firebase/auth";
import { arrayRemove, collection, collectionGroup, DocumentData, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";
import { colors } from "react-native-elements";
import { Card, FAB, Headline, IconButton, List, Modal, Paragraph, Portal, Surface, TextInput, Title, useTheme } from "react-native-paper";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MyContext } from "../constants/context";
import Event from "../components/Event";


const PersonalCalendar = (props: any) => {
    const [events, setEvents] = useState<any>([]);
    const user = getAuth().currentUser;
    const { groups, uid } = useContext(MyContext);
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    console.log(props)

    useEffect(() => {
        groups.forEach(async (group: any) => {
            const q = query(collection(db, 'group', group.id, "events"), orderBy('timestamp', 'desc'));
            let promise = await getDocs(q).then((res) => {
                res.forEach((doc) => {
                    console.log(doc.id)
                    setEvents((prevEvents: any) => ([...prevEvents, {id: doc.id, data:doc.data()}]))
                });
            });
        });

        const q2 = query(collection(db, "user", user?.email as string, "events"), orderBy('timestamp', 'desc'));
        const unsubscribeEvents = onSnapshot(q2, (snapshot) => {
            snapshot.docs.map((doc) => {
                setEvents((prevEvents: any) => ([...prevEvents, {id: doc.id, data:doc.data()}]));
            });
        });

        return () => {
            unsubscribeEvents();
        }
    }, []);

    const prepareEvents = (doc:any) => {
        doc.sort(sortEvents);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var dateStringToday = yyyy + '-' + mm + '-' + dd;

        
        // console.log(dateStringToday)
        return doc.slice(0,7);
        

    }

    function sortEvents(a: any, b: any) { 
        var dateA = new Date(a.data.timestamp).getTime();
        var dateB = new Date(b.data.timestamp).getTime();
        return dateA > dateB ? -1 : 1; 
    }; 

    const shownEvents = prepareEvents(events);
    return (
        <View style={{flex: 1}}>
            <View style={{flex: 3}}>
                <ScrollView contentContainerStyle={{ flexGrow:1 }}>
                <View>
                    <Title style={{alignSelf: "center", padding: 10}}>Upcoming Events</Title>
                        {shownEvents ? <>{shownEvents.map((event:any) => {
                            return(
                                <Event event={event} navigation={props.navigation}/>
                            );
                        })}</> : null}
                </View>
                </ScrollView>
            </View>
            <CalendarComponent personal={true} events={events} uid={uid} navigation={props.navigation} />
        </View>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 60
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    card: {
        borderRadius: 30,
        backgroundColor: '#4B9CD3',
        margin: 20,
        width: Platform.OS === 'ios' ? "90%" : "30%",
    },

    modalContainer: {
        backgroundColor: '#4B9CD3',
        padding: 20,
        margin: Platform.OS === 'web' ? '25%' : "10%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    inputContainer: {
        
        flex: 5,
        width: Platform.OS === 'ios' ? "80%" : "50%",
    },

    loading: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }


})
export default PersonalCalendar;