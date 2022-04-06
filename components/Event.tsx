import { getAuth } from "firebase/auth";
import { arrayRemove, collection, collectionGroup, DocumentData, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";
import { colors } from "react-native-elements";
import { Card, Chip, Divider, FAB, Headline, IconButton, List, Modal, Paragraph, Portal, Surface, TextInput, Title, useTheme } from "react-native-paper";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MyContext } from "../constants/context";
import { TouchableOpacity } from "react-native-gesture-handler";

const Event = (props: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const event = props.event;
    var color = props.color;

    if (color === 'blue') {
        color = '#13294B';

    } else {
        color = '#4B9CD3'
    }

    function formatDate(event: any) {

        let date = new Date(event);
        date.setDate(date.getDate() + 1);
        return (date.toDateString());
    }
    return (

        <View>
            <List.Item
                title={event.data.name}
                description={() =>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            <Icon name="schedule" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                            <Paragraph>{formatDate(event.data.timestamp)}</Paragraph>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Icon name="place" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                            <Paragraph>{event.data.location}</Paragraph>
                        </View>
                    </View>
                }
                right={() => (
                    <>
                        <Chip icon="information" style={{ margin: 20, backgroundColor: color }}>{"More Information"}</Chip>
                        <IconButton icon='chevron-right' style={{ marginTop: 15 }}></IconButton>
                    </>
                )}
                onPress={() => {
                    props.navigation.navigate('EventDashboard', { eid: event.id, event: event })
                }
                }
            />
            <Divider style={{ height: 2, backgroundColor: 'white' }} />
        </View>
    )

}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    card: {
        borderRadius: 30,
        margin: 10,
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
})
export default Event;