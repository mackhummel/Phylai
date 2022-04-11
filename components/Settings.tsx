import { StyleSheet, View, Platform } from 'react-native';
import React, { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile, User } from 'firebase/auth';
import { useTheme, Button, Divider, IconButton, Modal, Portal, Card, ActivityIndicator, Text, TextInput } from 'react-native-paper';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const anon = require('../assets/anon.png');

const Settings = (props: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const { colors } = useTheme();
    const [userProfile, setUserProfile] = useState<any>();
    const [edit, setEdit] = useState(false);
    const [photo, setPhoto] = useState<any>();
    const [username, setUsername] = useState<any>();
    const [firstName, setFirstName] = useState<any>();
    const [lastName, setLastName] = useState<any>();

    useEffect(() => {
        const docRef = doc(db, 'user', user?.email as string)
        const asyncProf = async () => {
            const docSnap = await getDoc(docRef)
            setUserProfile(docSnap.data());

        }
        asyncProf();
    }, []);

    useEffect(() => {
        if (userProfile) {
            setPhoto(userProfile.photoURL);
            setUsername(userProfile.username);
            setLastName(userProfile.lastName);
            setFirstName(userProfile.firstName);
        }
    }, [userProfile]);

    const selectPic = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        try {
            if (!pickerResult.cancelled) {
                setPhoto(pickerResult.uri);
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        }
    }

    const uploadImage = async (uri: any) => {
        if (uri === null) {
            return null;
        }
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const blob = await new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        const fileRef = ref(getStorage(), uuidv4());
        const result = await uploadBytesResumable(fileRef, blob);
        return await getDownloadURL(fileRef);
    }
    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Logout Successful")
        }).catch((error) => {
            console.log("Logout error: ", error.message);
        })
    }

    const cancelEdit = () =>{
        setUsername(userProfile.username);
        setPhoto(userProfile.photoURL);
        setFirstName(userProfile.firstName);
        setLastName(userProfile.lastName);
        setEdit(!edit);
    }
    const submitEdit = async() =>{
        const image = photo === userProfile.photoURL? userProfile.photoURL : await uploadImage(photo);

        const docRef = doc(db, 'user', user?.email as string)
        await updateDoc(docRef, {
            photoURL:image,
            lastName:lastName,
            firstName:firstName,
            username:username
        }).then(async () => {
            await updateProfile(user as User,{
                displayName: username,
                photoURL:image
            }).then(()=>{
                setEdit(!edit);
                props.update();
            }).catch((error) => console.log("Failed to Update User: " + error.message))
        }).catch((error) => console.log("Failed to Update User: " + error.message));
    }

    return (
        <>
            <IconButton icon={() => <Icon size={25} name='settings' />} onPress={() => setModalVisible(!modalVisible)} style={{ margin: -5 }} />
            <Portal >
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)} contentContainerStyle={styles.container}>
                    {edit ?
                        <>
                            <Card style={{ width: '100%', backgroundColor: 'transparent' }}>
                                <Card.Cover source={photo ? { uri: photo } : anon} style={{ resizeMode: 'center' }} />
                                <Card.Content>
                                    <Button icon='image-search' color={colors.surface} onPress={() => selectPic()}>
                                        New Profile Photo
                                    </Button>
                                    <TextInput
                                        autoComplete='never'
                                        placeholder='Username'
                                        value={username}
                                        textContentType='username'
                                        onChangeText={(text) => setUsername(text)}
                                        mode='outlined'
                                        theme={{ colors: { placeholder: 'white' } }}
                                    />
                                    <View style={styles.vertical}>
                                        <TextInput
                                            autoComplete='never'
                                            placeholder='First Name'
                                            value={firstName}
                                            textContentType='name'
                                            onChangeText={(text) => setFirstName(text)}
                                            style={{
                                                width: '48%',
                                            }}
                                            mode='outlined'
                                            theme={{ colors: { placeholder: 'white' } }}
                                        />
                                        <Divider style={{ width: "4%", backgroundColor: 'transparent' }} />
                                        <TextInput
                                            autoComplete='never'
                                            placeholder='Last Name'
                                            value={lastName}
                                            textContentType='name'
                                            onChangeText={(text) => setLastName(text)}
                                            style={{
                                                width: '48%',
                                            }}
                                            mode='outlined'
                                            theme={{ colors: { placeholder: 'white' } }}
                                        />
                                    </View>
                                </Card.Content>
                                <Card.Actions style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <Button icon='account-check-outline' mode='contained' color='green' onPress={submitEdit}>Submit</Button>
                                    <Button icon='cancel' mode='contained' color='red' onPress={cancelEdit} style={{marginTop:5}}>Cancel</Button>
                                </Card.Actions>
                            </Card>
                        </>
                        :
                        <>

                            {userProfile ?
                                <Card style={{ width: '100%', backgroundColor: 'transparent' }}>
                                    <Card.Cover source={photo ? { uri: photo } : anon} style={{ resizeMode: 'center' }} />
                                    <Card.Title title={username} subtitle={firstName + " " + lastName} />
                                    <Card.Actions style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                        <Button icon='account-edit' mode='contained' color={colors.surface} onPress={() => setEdit(!edit)}>Edit Account</Button>
                                        <Button icon='logout' mode='contained' color='red' onPress={signOutUser} style={{ marginTop: 5 }}>Logout</Button>
                                    </Card.Actions>
                                </Card>
                                :
                                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator color={colors.primary} size="large" />
                                </View>}
                        </>
                    }
                </Modal>
            </Portal>
        </>
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
    },
    vertical: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },

})
export default Settings;

