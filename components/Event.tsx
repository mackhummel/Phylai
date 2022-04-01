import { getAuth } from "firebase/auth";
import { arrayRemove, collection, collectionGroup, DocumentData, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";
import { colors } from "react-native-elements";
import { Card, FAB, Headline, IconButton, Modal, Paragraph, Portal, Surface, TextInput, Title, useTheme } from "react-native-paper";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MyContext } from "../constants/context";

const Event = (props: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const event = props.event;
    var color = props.color;

    if(color === 'blue'){
        color = '#13294B';

    }else{
        color = '#4B9CD3'
    }

    function formatDate(event: any) {

        let date = new Date(event);
        date.setDate(date.getDate()+1);
        return (date.toDateString());
    }
    return (

        <View style={{ alignItems: 'center' }}>
            <Card mode={"elevated"} style={{backgroundColor: color, borderRadius: 30,
                                        margin: 10,
                                        width: Platform.OS === 'ios' ? "90%" : "50%",}} >
                <Card.Content style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Title>{event.name}</Title>
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="schedule" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                                <Paragraph>{formatDate(event.timestamp)}</Paragraph>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Icon name="place" color="white" size={18} style={{ paddingTop: 3, paddingRight: 5 }} />
                                <Paragraph>{event.location}</Paragraph>
                            </View>
                        </View>
                        <View>
                            <Icon name="chevron-right" color="white" size={50} style={{ padding: 10 }} />
                        </View>
                    </View>
                </Card.Content>
            </Card>
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