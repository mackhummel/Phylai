import { getAuth } from "firebase/auth";
import { arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, SectionList, Image } from "react-native";
import { Button, Input } from "react-native-elements";
import { Appbar, List, Surface, Title } from "react-native-paper";
import Profile from "../components/Profile";
import { db } from '../config/firebase';

const EventPage = (props: any) => {

    const event = props.route.params.event;

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
    

    return (
        <View style={{ flex: 1, backgroundColor: '#13294B' }}>
            <Title>{event.data.name}</Title>
            
            <Text>{event.data.location}</Text>

        </View>
    );

}
export default EventPage;