import { StyleSheet, View, Platform } from 'react-native';
import React, { useState } from "react";
import { getAuth } from 'firebase/auth';
import { useTheme, Button, Divider, IconButton, Modal, Portal, List, Avatar, Card } from 'react-native-paper';
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
    const addAdmin = async () => {
        await updateDoc(doc(db, 'group', props.gid), {
            admin: arrayUnion(profile.email)
        }).then(() => {
            props.update();
            setModalVisible(!modalVisible);
        })
    }
    const removeFromGroup = async () => {
        await updateDoc(doc(db, 'group', props.gid), {
            member: arrayRemove(profile.email)
        }).then(() => {
            props.update();
            setModalVisible(!modalVisible);
        })
    }
    return (
        <View >
            <Portal >
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)} contentContainerStyle={styles.container}>
                    <Card style={{ width: '100%', backgroundColor: 'transparent' }}>
                        <Card.Cover source={profile.photoURL ? { uri: profile.photoURL } : anon} style={{ resizeMode: 'center' }} />
                        <Card.Title title={profile.username} subtitle={profile.firstName + " " + profile.lastName} />
                        {props.admin ?
                            <Card.Actions style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button icon='account-key' mode='contained' onPress={() => addAdmin()} color={colors.surface}>
                                        Make Admin
                                    </Button>
                                    <Button style={{ marginLeft: 10 }} icon='account-off' mode='contained' onPress={() => removeFromGroup()} color='red'>
                                        Remove
                                    </Button>
                                </View>
                            </Card.Actions>
                            : null}

                        {props.request === true ?
                            <Card.Actions style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button icon='check-outline' mode='contained' onPress={() => addFriend(profile.email)} color='green'>
                                        Accept
                                    </Button>
                                    <Button style={{ marginLeft: 10 }} icon='close-circle-outline' mode='contained' onPress={() => rejectRequest(profile.email)} color='red'>
                                        Reject
                                    </Button>
                                </View>
                            </Card.Actions>
                            : null}

                    </Card>
                </Modal>
            </Portal>
            <Divider style={{ backgroundColor: 'white' }} />
            <List.Item
                title={profile.username}
                description={profile.firstName + " " + profile.lastName}
                left={() => (
                    <Avatar.Image size={40} source={profile.photoURL ? { uri: profile.photoURL } : anon} />
                )}
                right={() => <IconButton icon='chevron-right' style={{ marginTop: 10 }}></IconButton>}
                onPress={() => setModalVisible(!modalVisible)}
            />
            <Divider style={{ backgroundColor: 'white', marginBottom: 5 }} />
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
