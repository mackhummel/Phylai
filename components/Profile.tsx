import { StyleSheet, View, Image, Platform } from 'react-native';
import React, { useState } from "react";
import { Input } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { useTheme, Button, TextInput, Divider, IconButton, Modal, Text, Portal, List, Avatar, Title, Subheading, Headline } from 'react-native-paper';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
const anon = require('../assets/anon.png');



const Profile = (props: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const { colors } = useTheme();
    const profile = props.profile;
    const request = props.request;

    const rejectRequest = async (rejectEmail: string) => {
        await updateDoc(doc(db, 'user', user?.email as string), {
            requests: arrayRemove(rejectEmail.toLowerCase())
        })
    }
    const addFriend = async (email: string) => {
        await updateDoc(doc(db, 'user', auth.currentUser?.email as string), {
            friends: arrayUnion(email.toLowerCase()),
            requests: arrayRemove(email.toLowerCase())
        }).then(async () => {
            await updateDoc(doc(db, 'user', email.toLowerCase()), {
                friends: arrayUnion(auth.currentUser?.email)
            }).then(() => {
                console.log("Successfully added friend")
            })
        })
    }
    return (
        <View >
            <Portal >
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)} contentContainerStyle={styles.container}>
                    <Avatar.Image size={80} source={profile.photoURL ? { uri: profile.photoURL } : anon} />
                    <Headline > {profile.username} </Headline>
                    <Title>{profile.firstName + " " + profile.lastName}</Title>
                    <Subheading>{profile.email}</Subheading>
                    {props.request === true ?
                        <View style={{flexDirection:'row' , marginTop:10}}>
                            <Button icon='check-outline' mode='contained' onPress={() => addFriend(profile.email)} color='green'>
                                Accept
                            </Button>
                            <Button style={{marginLeft:10}} icon='close-circle-outline' mode='contained' onPress={() => rejectRequest(profile.email)} color='red'>
                                Reject
                            </Button>
                        </View>
                        : null}
                </Modal>
            </Portal>
            <Divider style={{ backgroundColor:'white' }} />
            <List.Item
                title={profile.username}
                description={profile.firstName + " " + profile.lastName}
                left={() => (
                    <Avatar.Image size={40} source={profile.photoURL ? { uri: profile.photoURL } : anon} />
                )}
                right={()=><IconButton icon='chevron-right' style={{ marginTop: 10 }}></IconButton>}
                onPress={() => setModalVisible(!modalVisible)}
            />
            <Divider style={{ backgroundColor:'white', marginBottom:5}} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4B9CD3',
        padding: 20,
        margin: Platform.OS === 'web' ? '25%' : "10%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    }


})
export default Profile;
