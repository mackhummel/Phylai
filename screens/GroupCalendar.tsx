import { collectionGroup, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";
import { Appbar, Title, useTheme } from "react-native-paper";
import CalendarComponent from '../components/CalendarComponent';
import { db } from "../config/firebase";
import Event from "../components/Event";
import { MyContext } from "../constants/context";

const GroupCalendar = (props: any) => {
  //const { gid, name, admin } = props.route.params;
  const admin = props.admin;
  const group = props.group;
  console.log(props);
  const { uid } = useContext(MyContext);
  const { colors } = useTheme();

  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    setEvents(props.events);

    //poll changes in events
    const q2 = query(collectionGroup(db, 'events'), where("gid", "==", props.group.id), orderBy('timestamp', 'desc'));
    const unsubscribeEvents = onSnapshot(q2, (snapshot) => {
      snapshot.docs.map((doc) => {
        setEvents((prevEvents: any) => ([...prevEvents, { id: doc.id, data: doc.data() }]));
      });
    });
    return () => {
        unsubscribeEvents();
     }
}, []);





  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => props.navBack()} />
          <Appbar.Content title={group.data.name + ' Calendar'} />
        </Appbar.Header>
      )
    });



  }, []);

  const prepareEvents = (doc: any) => {
    doc.sort(sortEvents);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var dateStringToday = yyyy + '-' + mm + '-' + dd;


    // console.log(dateStringToday)
    return doc.slice(0, 7);


  }

  function sortEvents(a: any, b: any) {
    var dateA = new Date(a.data.timestamp).getTime();
    var dateB = new Date(b.data.timestamp).getTime();
    return dateA > dateB ? -1 : 1;
  };

  const shownEvents = prepareEvents(events);



  return (
    // <ScrollView contentContainerStyle={{alignItems:'center', justifyContent: 'center'}} >
    //    <View style={{width: Platform.OS === 'web' ? '50%': '100%', flex:1,}}>
    //       <CalendarComponent gid={group.id} admin={admin} events={events}/>
    //       </View>
    // </ScrollView>
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 3 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <Title style={{ alignSelf: "center", padding: 10 }}>Upcoming Events</Title>
            {shownEvents ? <>{shownEvents.map((event: any) => {
              return (
                <Event event={event} navigation={props.navigation}/>
              );
            })}</> : null}
          </View>
        </ScrollView>
      </View>
      <CalendarComponent personal={false} events={events} uid={uid} admin={admin} gid={group.id} navigation={props.navigation}/>
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
export default GroupCalendar;