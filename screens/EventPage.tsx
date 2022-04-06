import { getAuth } from "firebase/auth";
import { arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, SectionList, Image } from "react-native";
import { Input } from "react-native-elements";
import { Appbar, Card, List, Paragraph, Surface, TextInput, Title, Button } from "react-native-paper";
import Profile from "../components/Profile";
import { auth, db } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';


const EventPage = (props: any) => {
    const [editEventPressed, setEditEventPressed] = useState(false);
    const event = props.route.params.event;
    const user = auth.currentUser;
    const [eventName, setEventName] = useState(event.data.name);
    const [newDate, setNewDate] = useState(event.data.timestamp);
    const [eventInfo, setEventInfo] = useState(event.data.information);
    const [eventLocation, setEventLocation] = useState(event.data.location);

    function formatDate(event: any) {

        let date = new Date(event);
        date.setDate(date.getDate() + 1);
        return (date.toDateString());
    }

    console.log(props);

    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => props.navBack()} />
                    <Appbar.Content title={event.data.name} />
                </Appbar.Header>
            )
        });
    }, []);

    async function editEvent() {

        if(event.data.email === undefined){

            var docRef = doc(db, 'group', event.data.gid, "events", event.id);

            await updateDoc(docRef, {
                name: eventName,
                location: eventLocation,
                timestamp: newDate,
                information: eventInfo,
            });
            props.navBack();
        }else{
            var docRef = doc(db, "user", user?.email as string, "events", event.id);

            await updateDoc(docRef, {
                name: eventName,
                location: eventLocation,
                timestamp: newDate,
                information: eventInfo,
            });
            props.navBack()
        }
    }


    return (
        <View style={{ backgroundColor: '#13294B', height: "100%" }}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Title>{event.data.name}</Title>
                            <Icon onPress={() => {setEditEventPressed(!editEventPressed)}} name="settings" color="white" size={25} style={{ paddingTop: 7, paddingRight: 5 }} />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Icon name="schedule" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                            <Paragraph>{formatDate(event.data.timestamp)}</Paragraph>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Icon name="place" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                            <Paragraph>{event.data.location}</Paragraph>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Icon name="info" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                            <Paragraph>{event.data.information}</Paragraph>
                        </View>
                    </Card.Content>

                </Card>
                <Card>
                    {editEventPressed ? <View style={styles.container}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    mode='outlined'
                                    textContentType='name'
                                    placeholder='Event Name'
                                    value={eventName}
                                    onChangeText={(text) => setEventName(text)}
                                    multiline={true}
                                    autoComplete={false}
                                    theme={{ colors: { placeholder: 'white' } }}

                                />
                                <TextInput
                                    mode='outlined'
                                    textContentType='addressCity'
                                    placeholder='Event Location'
                                    value={eventLocation}
                                    onChangeText={(text) => setEventLocation(text)}
                                    autoComplete={false}
                                    theme={{ colors: { placeholder: 'white' } }}
                                />
                            </View>
                            <View>
                                <TextInput
                                    mode='outlined'
                                    placeholder='Event Date (YYYY-MM-DD)'
                                    value={newDate}
                                    onChangeText={(text) => setNewDate(text)}
                                    autoComplete={false}
                                    theme={{ colors: { placeholder: 'white' } }}
                                />
                                <TextInput
                                    mode='outlined'
                                    textContentType='name'
                                    placeholder='Event Information'
                                    value={eventInfo}
                                    onChangeText={(text) => setEventInfo(text)}
                                    autoComplete={false}
                                    theme={{ colors: { placeholder: 'white' } }}
                                />
                                <Button style={{ margin: 10 }} icon='account-multiple-plus-outline' mode='contained' onPress={() => editEvent()} color='green'>
                                    Edit Event
                                </Button>
                            </View>
                        </View>
                    </View> : null}
                </Card>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    card: {
        backgroundColor: '#4B9CD3',
        borderRadius: 30,
        margin: 10,
        width: Platform.OS === 'ios' ? "90%" : "30%",
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: '#4B9CD3',
        padding: 20,
        margin: Platform.OS === 'web' ? '25%' : "10%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-evenly',
    },
})
export default EventPage;
