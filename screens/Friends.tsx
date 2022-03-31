import { Platform, StyleSheet, View, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from "react";
import { Button, useTheme, TextInput, List, Avatar, Badge, Title, FAB, Portal, Modal, IconButton, Headline } from 'react-native-paper'
import { getAuth } from '@firebase/auth';
import { arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MyContext } from '../constants/context';
import Profile from '../components/Profile';



const Friends = (props: any) => {
    const { colors } = useTheme();
    const [friendEmail, setFriendEmail] = useState('');
    const auth = getAuth();
    const { friends, requests } = useContext(MyContext);
    const [friendsProfiles, setFriendsProfiles] = useState<any>([]);
    const [requestsProfiles, setRequestsProfiles] = useState<any>([]);
    const anon = require('../assets/anon.png');
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        if (friends.length === 0) {
            setFriendsProfiles([])
            return;
        }
        const queryFriend = query(collection(db, 'user'), where('email', "in", friends));
        const unsubscribeFriendsProfiles = onSnapshot(queryFriend, (snapshot) => setFriendsProfiles(snapshot.docs.map((doc) => ({ ...doc.data() }))));
        return () => {
            unsubscribeFriendsProfiles();
        }
    }, [friends]);
    useEffect(() => {
        if ((requests.length === 0)) {
            setRequestsProfiles([])
            return;
        }
        const queryRequest = query(collection(db, 'user'), where('email', "in", requests));
        const unsubscribeRequestsProfiles = onSnapshot(queryRequest, (snapshot) => setRequestsProfiles(snapshot.docs.map((doc) => ({ ...doc.data() }))));
        return () => {
            unsubscribeRequestsProfiles();
        }
    }, [requests]);


    const sendFriendRequest = async () => {
        if (!friends.filter((doc: any) => doc.email === friendEmail.toLowerCase())) {
            console.log('Already friends');
            return;
        }
        const friendDocRef = doc(db, 'user', friendEmail.toLowerCase() as string)
        await getDoc(friendDocRef).then(async (doc) => {
            if (!doc.data()?.requests.includes(auth.currentUser?.email)) {
                await updateDoc(friendDocRef, {
                    requests: arrayUnion(auth.currentUser?.email)
                })
                setFriendEmail('')
            }
            else {
                console.log('Already Send Request')
            }
        })


    }


    return (
        <View style={{ flex: 1 }} >
            <List.AccordionGroup>
                <List.Accordion title='Friend Requests' left={() => <>{requestsProfiles?.length > 0 ? <Badge style={{ marginBottom: 10 }}>{requests.length}</Badge> : null}</>} id='1'>
                    {requestsProfiles ? requestsProfiles.map((profile: any) => {
                        return (
                            <Profile profile={profile} request={true} />

                        )
                    }
                    ) : null}
                </List.Accordion>
            </List.AccordionGroup>

            <List.Section>
                <List.Subheader><Title>Friends</Title></List.Subheader>
                <ScrollView>{friendsProfiles ? friendsProfiles.map((profile: any) => {
                    return (
                        <Profile profile={profile} />
                    )
                }) : null}</ScrollView>
            </List.Section>
            <FAB
                style={styles.fab}
                icon='account-plus'
                onPress={() => setModalVisible(!modalVisible)}
                color={colors.surface}
            />
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)} contentContainerStyle={styles.modalContainer}>
                    <Headline>Send Friend Request</Headline>
                    <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center' }}>

                        <View style={styles.inputContainer}><TextInput
                            mode='outlined'
                            textContentType='emailAddress'
                            placeholder='Enter Email...'
                            value={friendEmail}
                            onChangeText={(text) => setFriendEmail(text)}
                            onSubmitEditing={() => sendFriendRequest()}
                            autoComplete={false}
                            theme={{ colors: { placeholder: 'white' } }}
                        /></View>
                        <View style={{ flex: 1 }}>
                            <IconButton size={40} icon='send-circle'></IconButton>
                        </View>
                    </View>

                </Modal>
            </Portal>
            {/* <View style={styles.container}><View style={styles.inputContainer}>
                    <TextInput
                        autoComplete='never'
                        placeholder='Email'
                        onChangeText={(text) => setFriendEmail(text)}
                        textContentType='emailAddress'
                        value={friendEmail}
                        onSubmitEditing={sendFriendRequest}
                    ></TextInput>
                </View>
                <Button
                    onPress={sendFriendRequest}
                    mode="contained"
                >Send Request</Button>
               
                </View> */}

        </View>
    )
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
export default Friends;
