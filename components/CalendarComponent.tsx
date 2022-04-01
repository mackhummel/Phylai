import React, { useState, useContext, useEffect, Component, Fragment } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Calendar, Agenda, CalendarProps, CalendarList } from "react-native-calendars";
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import moment from 'moment';
import { addDoc, collection, collectionGroup, doc, getDoc, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { FAB, Headline, IconButton, Modal, Portal, TextInput, Title, useTheme } from 'react-native-paper';
import Event from './Event';

const CalendarComponent = (props: any) => {
    const { gid, events, admin, personal, uid } = props;
    const { colors } = useTheme();
    const user = getAuth().currentUser
    const [eventName, setEventName] = useState('');
    const [newDate, setNewDate] = useState('');
    const [eventInfo, setEventInfo] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [markedObjects, setMarkedObjects] = useState<any>({});
    const [userId, setUserId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [addEventVisible, setAddEventVisible] = useState(false);


    let today = new Date().toISOString().slice(0, 10);

    const [selected, setSelected] = useState(today);
    interface markedObj {
        [key: string]: {};
    }
    const markedDates: markedObj = {};

    useEffect(() => {

        events.forEach((event: { timestamp: any; }) => {
            markedDates[event.timestamp] = { marked: true, dotColor: '#13294B' };
        });
        setMarkedObjects(markedDates);



    }, [events]);



    const addEvent = async () => {

        if ((eventName === "") || (newDate === "")) {
            return;
        }
        if (personal) {
            console.log(uid);
            await addDoc(collection(db, "user", user?.email as string, "events"), {
                email: user?.email,
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


        } else {
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
    }

    const addEventShow = () => {

        return (
            <View>
                <TextInput
                    placeholder='Event Name'
                    value={eventName}
                    onChangeText={(text) => setEventName(text)}
                    autoComplete={false}
                />
                <TextInput
                    placeholder='Event Date (yyyy-mm-dd)'
                    value={newDate}
                    onChangeText={(text) => setNewDate(text)}
                    autoComplete={false}
                />
                <TextInput
                    label='Event Location'
                    value={eventLocation}
                    onChangeText={(text) => setEventLocation(text)}
                    autoComplete={false}
                />
                <TextInput
                    placeholder='Event Information'
                    value={eventInfo}
                    onChangeText={(text) => setEventInfo(text)}
                    autoComplete={false}
                />
                <Button
                    onPress={() => addEvent()}
                    title="Add Event"
                    buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
                />
            </View>
        );



    }

    const onDayPress: CalendarProps['onDayPress'] = day => {
        setSelected(day.dateString);
    };

    const displayEvents = (day: any) => {

        //filter selected events
        const filteredEvents = events.filter((event: any) => day === event.timestamp);



        return (
            <View>
                {filteredEvents.length === 0 ? null : filteredEvents.map((doc: any) => {
                    return (
                        <Event event={doc} color={'blue'} />
                    )
                })
                }
            </View>
        )
    }

    function formatDate(event: any) {

        let date = new Date(event);
        date.setDate(date.getDate() + 1);
        return (date.toDateString());
    }


    return (
        <View >
            <FAB
                style={styles.fab}
                icon='calendar'
                onPress={() => setModalVisible(!modalVisible)}
                color={colors.surface}
            />
            <Portal>
                <Modal
                    visible={modalVisible}
                    contentContainerStyle={styles.modalContainer}
                    onDismiss={() => setModalVisible(!modalVisible)}
                >
                    <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
                        <Calendar
                            enableSwipeMonths={true}
                            current={today}
                            //style={styles.calendar}
                            renderArrow={(direction) => {
                                if (direction == "left")
                                    return (
                                        <IconButton icon='arrow-left-bold-outline' color={colors.primary} />
                                    );
                                if (direction == "right")
                                    return (

                                        <IconButton icon='arrow-right-bold-outline' color={colors.primary} />

                                    );
                            }}
                            onDayPress={onDayPress}
                            hideArrows={false}
                            markedDates={{
                                ...markedObjects, [selected]: {
                                    selected: true,
                                    disableTouchEvent: true,
                                    selectedColor: '#13294B',
                                    selectedTextColor: 'white'
                                }
                            }
                            }
                            theme={{
                                arrowColor: 'blue',
                                textColor: 'white',
                                backgroundColor: '#4B9CD3',
                                calendarBackground: '#4B9CD3',
                                dotColor: '#13294B',
                                todayTextColor: '#13294B',
                                monthTextColor: 'white',
                                dayTextColor: 'white',
                                textDisabledColor: '#c4c4c4',
                                indicatorColor: 'white',
                                textSectionTitleColor: 'white',
                                textSectionTitleDisabledColor: '#d9e1e8',


                                // textSectionTitleColor: 'white',
                            }}
                            style={styles.calendar}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Title>{formatDate(selected)}</Title>
                            <IconButton icon={'plus'} onPress={() => addEventShow()}></IconButton>
                        </View>
                        {/* <View>
                            <View >
                                <TextInput
                                    placeholder='Event Name'
                                    value={eventName}
                                    onChangeText={(text) => setEventName(text)}
                                    autoComplete={false}
                                />
                                <TextInput
                                    placeholder='Event Date (yyyy-mm-dd)'
                                    value={newDate}
                                    onChangeText={(text) => setNewDate(text)}
                                    autoComplete={false}
                                />
                                <TextInput
                                    label='Event Location'
                                    value={eventLocation}
                                    onChangeText={(text) => setEventLocation(text)}
                                    autoComplete={false}
                                />
                                <TextInput
                                    placeholder='Event Information'
                                    value={eventInfo}
                                    onChangeText={(text) => setEventInfo(text)}
                                    autoComplete={false}
                                />
                                <Button
                                    onPress={() => addEvent()}
                                    title="Add Event"
                                    buttonStyle={{ backgroundColor: 'rgba(111, 202, 186, 1)' }}
                                />
                            </View>
                        </View> */}
                        {displayEvents(selected)}
                    </View>
                </Modal>
            </Portal>
            {/* <View style={styles.list}>
                <Fragment>
                    {(admin || personal) &&
                        <View>
                            <Input
                            placeholder='Event Name'
                            value={eventName}
                            onChangeText={(text) => setEventName(text)}
                            />
                            <Input
                                placeholder='Event Date (yyyy-mm-dd)'
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
                        </View>
                    }
                    <Calendar
                        enableSwipeMonths={true}
                        current={today}
                        //style={styles.calendar}
                        renderArrow={(direction) => {
                            if (direction == "left")
                              return (
                                <IconButton icon='arrow-left-bold-outline' color={colors.primary} />
                              );
                            if (direction == "right")
                              return (
                                
                                  <IconButton icon='arrow-right-bold-outline' color={colors.primary}/>
                               
                              );
                          }}
                        onDayPress={onDayPress}
                        hideArrows={false}
                        markedDates={{
                            ...markedObjects, [selected]: {
                                selected: true,
                                disableTouchEvent: true,
                                selectedColor: 'blue',
                                selectedTextColor: 'white'
                            }
                        }
                        }
                        theme={{ arrowColor: 'blue' }}
                    />
                </Fragment>
                {displayEvents(selected)}
            </View> */}
        </View>

    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendar: {
        width: '100%'
    },
    modalEvent: {
        backgroundColor: "blue",
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
        elevation: 5,
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: '#4B9CD3',
        padding: 20,
        marginTop: '7.5%',
        height: '90%',
        alignSelf: 'center',
        width: Platform.OS === 'ios' ? "100%" : "50%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    list: {
        borderColor: "black",
        borderWidth: 2,
        margin: 10,
        padding: 5,
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
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
    }
});
export default CalendarComponent;